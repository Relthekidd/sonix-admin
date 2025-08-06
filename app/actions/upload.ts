'use server'

import slugify from 'slugify'
import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { logError } from '../../utils/logger'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

/**
 * Handles uploading a single track: uploads files and inserts track record.
 */
export async function uploadSingleAction(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  const supabase = getSupabase()
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      logError('Auth fetch error', authError)
      return { success: false, message: authError.message }
    }
    const userId = authData?.user?.id || null

  const title = formData.get('title') as string
  const artistId = formData.get('artist') as string
  const genre = formData.get('genre') as string
  const mood = formData.get('mood') as string
  const description = formData.get('description') as string
  const lyrics = formData.get('lyrics') as string
  const releaseDate = formData.get('releaseDate') as string
  const featuredArtistsRaw = formData.get('featuredArtists') as string | null
  const duration = formData.get('duration') as string
  const published = formData.get('published') === 'on'
  const audio = formData.get('audio') as File
  const cover = (formData.get('cover') as File) || null

  const slug = slugify(title, { lower: true, strict: true })

  // Upload audio file
    const { data: audioData, error: audioError } = await supabase.storage
      .from('audio-files')
      .upload(`audio/${slug}-${Date.now()}`, audio)
    if (audioError || !audioData) {
      logError('Audio upload error', audioError)
      return { success: false, message: audioError?.message }
    }
    const audioUrl = audioData.path

  // Upload cover image if provided
  let coverPath: string | null = null
  if (cover) {
      const { data: coverData, error: coverError } = await supabase.storage
        .from('images')
        .upload(`covers/${slug}-${Date.now()}`, cover)
      if (coverError || !coverData) {
        logError('Cover upload error', coverError)
        return { success: false, message: coverError?.message }
      }
      coverPath = coverData.path
  }

  // Parse featured artist IDs
  const featuredArtistIds = featuredArtistsRaw
    ? (JSON.parse(featuredArtistsRaw) as string[])
    : []

  // Parse duration to seconds
  const durationSeconds = (() => {
    if (!duration) return null
    if (duration.includes(':')) {
      const [m, s] = duration.split(':').map(Number)
      return m * 60 + (s || 0)
    }
    return Number(duration)
  })()

  // Combine genres
  const genres = [genre, mood].filter(Boolean)

  // Insert track record
    const { error } = await supabase.from('tracks').insert({
    title,
    artist_id: artistId,
    audio_url: audioUrl,
    cover_url: coverPath,
    description,
    lyrics,
    featured_artist_ids: featuredArtistIds.length ? featuredArtistIds : null,
    release_date: releaseDate || null,
    duration: durationSeconds,
    genres,
    published,
    slug,
    created_by: userId,
  })
    if (error) {
      logError('Track insert error', error)
      return { success: false, message: error.message }
    }

    return { success: true }
  } catch (err: any) {
    logError('Upload single unexpected error', err)
    return { success: false, message: err.message }
  }
}

/**
 * Inserts a new artist record, using current user as creator.
 */
export type UploadArtistPayload = {
  name: string
  bio?: string
  avatar_url?: string
  profile_picture_url?: string
  image_url?: string
  status?: string
}

export async function uploadArtistAction(
  payload: UploadArtistPayload
): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = getSupabase()
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      logError('Auth fetch error', authError)
      return { success: false, error: authError.message }
    }
    const userId = authData?.user?.id || null

    const { data, error } = await supabase.from('artists').insert([
      { ...payload, created_by: userId }
    ])
    if (error) {
      logError('Artist insert error', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err: any) {
    logError('Upload artist unexpected error', err)
    return { success: false, error: err.message }
  }
}


export interface PlaylistTrackInput {
  track_id: string;
  position: number;
}

export interface UpsertPlaylistPayload {
  id?: string;
  name: string;
  description?: string;
  cover?: File | null;
  genres?: string[];
  moods?: string[];
  isPublic?: boolean;
  sortOrder?: number;
  tracks: PlaylistTrackInput[];
}

export async function upsertPlaylistAction(
  payload: UpsertPlaylistPayload
): Promise<{ success: boolean; message?: string; id?: string }> {
  const supabase = getSupabase();
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      logError('Auth fetch error', authError);
      return { success: false, message: authError.message };
    }
    const userId = authData?.user?.id || null;

    let coverUrl: string | null = null;
    if (payload.cover) {
      const ext = payload.cover.name.split('.').pop();
      const path = `covers/${slugify(payload.name, { lower: true, strict: true })}-${Date.now()}.${ext}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from('images')
        .upload(path, payload.cover);
      if (coverError || !coverData) {
        logError('Cover upload error', coverError);
        return { success: false, message: coverError?.message };
      }
      coverUrl = coverData.path;
    }

    const { data: playlistData, error: playlistError } = await supabase
      .from('playlists')
      .upsert({
        id: payload.id,
        title: payload.name,
        description: payload.description,
        cover_url: coverUrl ?? undefined,
        genres: payload.genres ?? null,
        moods: payload.moods ?? null,
        is_public: payload.isPublic ?? true,
        sort_order: payload.sortOrder ?? null,
        updated_by: userId,
      })
      .select()
      .single();

    if (playlistError) {
      logError('Playlist upsert error', playlistError);
      return { success: false, message: playlistError.message };
    }

    const playlistId = playlistData.id;

    await supabase.from('playlist_tracks').delete().eq('playlist_id', playlistId);
    const trackRows = payload.tracks.map((t) => ({
      playlist_id: playlistId,
      track_id: t.track_id,
      position: t.position,
    }));
    if (trackRows.length) {
      const { error: tracksError } = await supabase
        .from('playlist_tracks')
        .insert(trackRows);
      if (tracksError) {
        logError('Playlist tracks insert error', tracksError);
        return { success: false, message: tracksError.message };
      }
    }

    return { success: true, id: playlistId };
  } catch (err: any) {
    logError('Upsert playlist unexpected error', err);
    return { success: false, message: err.message };
  }
}
