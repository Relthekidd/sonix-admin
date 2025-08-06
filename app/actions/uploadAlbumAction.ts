// ── app/actions/uploadAlbumAction.ts ──

import slugify from 'slugify'
import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { logError } from '../../utils/logger'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

type Result = { success: true } | { success: false; message: string }

export async function uploadAlbumAction(formData: FormData): Promise<Result> {
  const supabase = getSupabase()
  let albumId: string | null = null
  const uploadedFiles: Array<{ bucket: string; path: string }> = []
  try {
    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      logError('Album auth fetch error', authError)
      return { success: false, message: authError.message }
    }
    const userId = authData.user!.id

    // Album fields
    const title = formData.get('title') as string
    const mainArtistId = formData.get('mainArtistId') as string
    const releaseDate = (formData.get('releaseDate') as string) || undefined
    const coverFile = formData.get('cover') as File | null
    const featuredArtistsRaw = formData.get('featuredArtists') as string | null
    const albumFeaturedArtistIds = featuredArtistsRaw
      ? (JSON.parse(featuredArtistsRaw) as string[])
      : []

    // Duplicate album check
    const { data: existingAlbum } = await supabase
      .from('albums')
      .select('id')
      .eq('title', title)
      .eq('main_artist_id', mainArtistId)
      .maybeSingle()
    if (existingAlbum) {
      return { success: false, message: 'Album already exists' }
    }

    // Track metadata
    const tracksMeta = JSON.parse(
      formData.get('tracks') as string
    ) as Array<{
      title: string
      lyrics?: string
      featuredArtistIds: string[]
    }>

    // Insert album
    const { data: albumData, error: albumError } = await supabase
      .from('albums')
      .insert({
        title,
        main_artist_id: mainArtistId,
        featured_artist_ids: albumFeaturedArtistIds,
        release_date: releaseDate,
        created_by: userId,
      })
      .select('id')
      .single()
    if (albumError || !albumData) {
      logError('Album insert error', albumError)
      return {
        success: false,
        message: albumError?.message ?? 'Failed to create album',
      }
    }
    albumId = albumData.id

    // Upload cover
    let coverPath: string | null = null
    if (coverFile) {
      const coverSlug = slugify(title, { lower: true, strict: true })
      const coverTs = Date.now()
      coverPath = `album_covers/${albumId}/${coverSlug}-${coverTs}`
      const { error: coverError } = await supabase.storage
        .from('images')
        .upload(coverPath, coverFile, { upsert: false })
      if (coverError) {
        logError('Album cover upload error', coverError)
        await supabase.from('albums').delete().eq('id', albumId)
        return { success: false, message: coverError.message }
      }
      uploadedFiles.push({ bucket: 'images', path: coverPath })
      const { error: coverUpdateError } = await supabase
        .from('albums')
        .update({ cover_url: coverPath })
        .eq('id', albumId)
      if (coverUpdateError) {
        logError('Album cover update error', coverUpdateError)
        await supabase.storage.from('images').remove([coverPath])
        await supabase.from('albums').delete().eq('id', albumId)
        return { success: false, message: coverUpdateError.message }
      }
    }

    // Upload tracks
    for (let i = 0; i < tracksMeta.length; i++) {
      const meta = tracksMeta[i]
      const file = formData.get(`trackFile${i}`) as File | null
      let audioPath = ''
      if (file) {
        const trackSlug = slugify(meta.title, { lower: true, strict: true })
        const audioTs = Date.now()
        audioPath = `audio/${albumId}/${trackSlug}-${audioTs}`
        const { error: audioError } = await supabase.storage
          .from('audio-files')
          .upload(audioPath, file, { upsert: false })
        if (audioError) {
          logError(`Track ${i} audio upload error`, audioError)
          uploadedFiles.forEach(f =>
            supabase.storage.from(f.bucket).remove([f.path])
          )
          await supabase.from('tracks').delete().eq('album_id', albumId)
          await supabase.from('albums').delete().eq('id', albumId)
          return { success: false, message: audioError.message }
        }
        uploadedFiles.push({ bucket: 'audio-files', path: audioPath })
      }

      const featuredArtistIds = meta.featuredArtistIds || []
      const { error: trackError } = await supabase
        .from('tracks')
        .insert({
          title: meta.title,
          artist_id: mainArtistId,
          lyrics: meta.lyrics ?? null,
          featured_artist_ids: featuredArtistIds,
          album_id: albumId,
          track_number: i + 1,
          cover_url: coverPath,
          audio_url: audioPath,
          created_by: userId,
        })
      if (trackError) {
        logError(`Track ${i} insert error`, trackError)
        uploadedFiles.forEach(f =>
          supabase.storage.from(f.bucket).remove([f.path])
        )
        await supabase.from('tracks').delete().eq('album_id', albumId)
        await supabase.from('albums').delete().eq('id', albumId)
        return { success: false, message: trackError.message }
      }
    }

    return { success: true }
  } catch (err: any) {
    logError('Upload album unexpected error', err)
    if (albumId) {
      uploadedFiles.forEach(f =>
        supabase.storage.from(f.bucket).remove([f.path])
      )
      await supabase.from('tracks').delete().eq('album_id', albumId)
      await supabase.from('albums').delete().eq('id', albumId)
    }
    return { success: false, message: err.message }
  }
}

export default uploadAlbumAction

