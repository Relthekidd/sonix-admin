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
    const is_published = formData.get('published') === 'on'
    const audio = formData.get('audio') as File
    const cover = (formData.get('cover') as File) || null

    const slug = slugify(title, { lower: true, strict: true })

    // Prevent duplicate slugs
    const { data: existing } = await supabase
      .from('tracks')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (existing) {
      return { success: false, message: 'Track already exists' }
    }

    let audioPath = ''
    let coverPath: string | null = null

    // Upload audio
    const audioTs = Date.now()
    audioPath = `tracks/${slug}-${audioTs}`
    const { error: audioError } = await supabase.storage
      .from('audio-files')
      .upload(audioPath, audio, { upsert: false })
    if (audioError) {
      logError('Audio upload error', audioError)
      return { success: false, message: audioError.message }
    }

    // Upload cover
    if (cover) {
      const coverTs = Date.now()
      coverPath = `covers/${slug}-${coverTs}`
      const { error: coverError } = await supabase.storage
        .from('images')
        .upload(coverPath, cover, { upsert: false })
      if (coverError) {
        // rollback audio
        await supabase.storage.from('audio-files').remove([audioPath])
        logError('Cover upload error', coverError)
        return { success: false, message: coverError.message }
      }
    }

    const featuredArtistIds = featuredArtistsRaw
      ? (JSON.parse(featuredArtistsRaw) as string[])
      : []

    const durationSeconds = (() => {
      if (!duration) return null
      if (duration.includes(':')) {
        const [m, s] = duration.split(':').map(Number)
        return m * 60 + (s || 0)
      }
      return Number(duration)
    })()

    const genres = [genre, mood].filter(Boolean)

    const { error } = await supabase.from('tracks').insert({
      title,
      artist_id: artistId,
      audio_url: audioPath,
      cover_url: coverPath,
      description,
      lyrics,
      featured_artist_ids: featuredArtistIds.length ? featuredArtistIds : null,
      release_date: releaseDate || null,
      duration: durationSeconds,
      genres,
      is_published,
      slug,
      created_by: userId,
    })

    if (error) {
      await supabase.storage.from('audio-files').remove([audioPath])
      if (coverPath) await supabase.storage.from('images').remove([coverPath])
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
  id: string
  name: string
  bio?: string
  avatar_url?: string
  profile_picture_url?: string
  image_url?: string
  genres?: string[]
  is_featured?: boolean
  is_verified?: boolean
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
