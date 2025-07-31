'use server'

import slugify from 'slugify'
import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

export async function uploadSingleAction(formData: FormData) {
  const supabase = getSupabase()
  const title = formData.get('title') as string
  const artist = formData.get('artist') as string
  const genre = formData.get('genre') as string
  const mood = formData.get('mood') as string
  const description = formData.get('description') as string
  const lyrics = formData.get('lyrics') as string
  const releaseDate = formData.get('releaseDate') as string
  const albumId = formData.get('albumId') as string
  const featuredArtists = formData.get('featuredArtists') as string
  const language = formData.get('language') as string
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

  const { error: insertError } = await supabase.from('tracks').insert({
    title,
    artist_id: artist,
    genre,
    mood,
    description,
    lyrics,
    release_date: releaseDate,
    album_id: albumId || null,
    featured_artists: featuredArtists,
    language,
    duration,
    published,
    audio_url: audioData.path,
    cover_path: coverPath,
    slug
  })

  if (insertError) return { success: false, message: insertError.message }
  return { success: true }
}

export async function uploadAlbumAction(formData: FormData) {
  const supabase = getSupabase()
  const title = formData.get('title') as string
  const artist = formData.get('artist') as string
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
      artist_id: artist,
      genre,
      description,
      release_date: releaseDate,
      published,
      cover_path: coverPath,
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

    const { error } = await supabase.from('tracks').insert({
      title: track.title,
      artist_id: artist,
      album_id: albumData.id,
      audio_url: audioData.path,
      lyrics: track.lyrics,
      featured_artists: track.featuredArtists,
      slug: trackSlug,
      published
    })
    if (error) return { success: false, message: error.message }
  }

  return { success: true }
}
