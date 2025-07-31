'use server'

import slugify from 'slugify'
import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

export async function uploadSingleAction(formData: FormData) {
  const supabase = getSupabase()
  const title = formData.get('title') as string
  const artistId = formData.get('artist') as string
  const genre = formData.get('genre') as string
  const mood = formData.get('mood') as string
  const description = formData.get('description') as string
  const lyrics = formData.get('lyrics') as string
  const releaseDate = formData.get('releaseDate') as string
  const albumId = formData.get('albumId') as string
  const featuredArtists = formData.get('featuredArtists') as string
  const duration = formData.get('duration') as string
  const published = formData.get('published') === 'on'
  const audio = formData.get('audio') as File
  const cover = formData.get('cover') as File | null

  const slug = slugify(title, { lower: true, strict: true })

  const { data: audioData, error: audioError } = await supabase.storage
    .from('audio-files')
    .upload(`tracks/${slug}-${Date.now()}`, audio)
  if (audioError) return { success: false, message: audioError.message }

  let coverPath: string | null = null
  if (cover) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`covers/${slug}-${Date.now()}`, cover)
    if (error) return { success: false, message: error.message }
    coverPath = data.path
  }

  const featuredArtistIds = featuredArtists
    ? featuredArtists.split(',').map(id => id.trim()).filter(Boolean)
    : null

  const durationSeconds = (() => {
    if (!duration) return null
    if (duration.includes(':')) {
      const [m, s] = duration.split(':').map(Number)
      return m * 60 + (s || 0)
    }
    return Number(duration)
  })()

  const genres = [genre, mood].filter(Boolean)

  const { error: insertError } = await supabase.from('tracks').insert({
    title,
    artist_id: artistId || null,
    album_id: albumId || null,
    featured_artist_ids: featuredArtistIds,
    description,
    lyrics,
    genres: genres.length ? genres : null,
    release_date: releaseDate || null,
    duration: durationSeconds,
    is_published: published,
    audio_url: audioData.path,
    cover_url: coverPath
  })

  if (insertError) return { success: false, message: insertError.message }
  return { success: true }
}

export async function uploadAlbumAction(formData: FormData) {
  const supabase = getSupabase()
  const title = formData.get('title') as string
  const artistId = formData.get('artist') as string
  const genre = formData.get('genre') as string
  const description = formData.get('description') as string
  const albumId = formData.get('albumId') as string
  const releaseDate = formData.get('releaseDate') as string
  const published = formData.get('published') === 'on'
  const cover = formData.get('cover') as File | null

  const slug = slugify(title, { lower: true, strict: true })

  let coverPath: string | null = null
  if (cover) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`albums/${slug}-${Date.now()}`, cover)
    if (error) return { success: false, message: error.message }
    coverPath = data.path
  }

  const { data: albumData, error: albumErr } = await supabase
    .from('albums')
    .insert({
      id: albumId || undefined,
      title,
      artist_id: artistId,
      genre,
      description,
      release_date: releaseDate,
      published,
      cover_url: coverPath,
      slug
    })
    .select()
    .single()

  if (albumErr || !albumData) return { success: false, message: albumErr?.message }

  const tracks: any[] = JSON.parse(formData.get('tracks') as string || '[]')
  for (const track of tracks) {
    const trackSlug = slugify(track.title, { lower: true, strict: true })
    const { data: audioData, error: audioErr } = await supabase.storage
      .from('audio-files')
      .upload(`tracks/${trackSlug}-${Date.now()}`, track.file as File)
    if (audioErr) return { success: false, message: audioErr.message }

    const trackFeatured = track.featuredArtists
      ? track.featuredArtists.split(',').map((id: string) => id.trim()).filter(Boolean)
      : null

    const { error } = await supabase.from('tracks').insert({
      title: track.title,
      artist_id: artistId,
      album_id: albumData.id,
      audio_url: audioData.path,
      lyrics: track.lyrics,
      featured_artist_ids: trackFeatured,
      is_published: published,
      genres: genre ? [genre] : null,
      release_date: releaseDate || null
    })
    if (error) return { success: false, message: error.message }
  }

  return { success: true }
}