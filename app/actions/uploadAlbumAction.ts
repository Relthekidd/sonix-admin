'use server'

import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

export async function uploadAlbumAction(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  const supabase = getSupabase()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) {
    console.error('Auth fetch error:', authError.message)
    return { success: false, message: authError.message }
  }
  const userId = authData?.user?.id || null

  const title = formData.get('title') as string
  const artistId = formData.get('main_artist_id') as string
  const releaseDate = formData.get('releaseDate') as string
  const coverFile = formData.get('cover') as File | null
  const tracksMeta = JSON.parse(formData.get('tracks') as string) as Array<{
    title: string
    lyrics: string
    featuredArtists: string
  }>

  // create empty album row to get id
  const { data: albumData, error: albumError } = await supabase
    .from('albums')
    .insert({
      title,
      artist_id: artistId,
      release_date: releaseDate || null,
      created_by: userId,
    })
    .select('id')
    .single()
  if (albumError) {
    console.error('Album insert error:', albumError.message)
    return { success: false, message: albumError.message }
  }
  const albumId = albumData.id

  // upload cover art using album id
  let coverUrl: string | null = null
  if (coverFile) {
    const ext = coverFile.name.split('.').pop() || 'jpg'
    const path = `covers/${albumId}.${ext}`
    const { data: coverData, error: coverError } = await supabase.storage
      .from('images')
      .upload(path, coverFile, { upsert: true })
    if (coverError) {
      console.error('Cover upload error:', coverError.message)
      return { success: false, message: coverError.message }
    }
    coverUrl = coverData.path
    const { error: updateError } = await supabase
      .from('albums')
      .update({ cover_url: coverUrl })
      .eq('id', albumId)
    if (updateError) {
      console.error('Album cover update error:', updateError.message)
      return { success: false, message: updateError.message }
    }
  }

  // insert tracks and upload audio files in parallel
  try {
    await Promise.all(
      tracksMeta.map(async (meta, index) => {
        const featuredIds = meta.featuredArtists
          ? meta.featuredArtists.split(',').map(id => id.trim()).filter(Boolean)
          : null

        // insert track row to get id
        const { data: trackData, error: trackInsertError } = await supabase
          .from('tracks')
          .insert({
            title: meta.title,
            lyrics: meta.lyrics,
            featured_artist_ids: featuredIds,
            album_id: albumId,
            track_number: index + 1,
            cover_url: coverUrl,
            created_by: userId,
          })
          .select('id')
          .single()
        if (trackInsertError) throw new Error(trackInsertError.message)
        const trackId = trackData.id

        // upload audio file
        const file = formData.get(`trackFile${index}`) as File | null
        if (!file) return
        const ext = file.name.split('.').pop() || 'mp3'
        const audioPath = `track/${albumId}/${trackId}.${ext}`
        const { data: audioData, error: audioError } = await supabase.storage
          .from('audio-files')
          .upload(audioPath, file, { upsert: true })
        if (audioError) throw new Error(audioError.message)

        const { error: audioUpdateError } = await supabase
          .from('tracks')
          .update({ audio_url: audioData.path })
          .eq('id', trackId)
        if (audioUpdateError) throw new Error(audioUpdateError.message)
      })
    )
  } catch (err: any) {
    console.error('Track upload error:', err.message)
    return { success: false, message: err.message }
  }

  return { success: true }
}

