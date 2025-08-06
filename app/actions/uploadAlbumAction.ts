// ── app/actions/uploadAlbumAction.ts ──

import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { logError } from '../../utils/logger'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

type Result = { success: true } | { success: false; message: string }

export async function uploadAlbumAction(formData: FormData): Promise<Result> {
  const supabase = getSupabase()
  try {
    // 1. Get the current user
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      logError('Album auth fetch error', authError)
      return { success: false, message: authError.message }
    }
    const userId = authData.user!.id

    // 2. Extract album fields
    const title = formData.get('title') as string
    const mainArtistId = formData.get('mainArtistId') as string
    const description = (formData.get('description') as string) || undefined
    const releaseDate = (formData.get('releaseDate') as string) || undefined
    const coverFile = formData.get('cover') as File | null
    const featuredArtistsRaw = formData.get('featuredArtists') as string | null
    const albumFeaturedArtistIds = featuredArtistsRaw
      ? (JSON.parse(featuredArtistsRaw) as string[])
      : []

    // Track metadata is expected as a JSON string under 'tracks'
    const tracksMeta = JSON.parse(formData.get('tracks') as string) as Array<{
      title: string
      lyrics?: string
      featuredArtistIds: string[]
      trackNumber?: number
      duration?: number
    }>

    // 3. Insert the album record
    const { data: albumData, error: albumError } = await supabase
      .from('albums')
      .insert({
        title,
        artist_id: mainArtistId,
        description,
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
    const albumId = albumData.id

    // 4. Upload & set the album cover (if provided)
    let coverPath: string | null = null
    if (coverFile) {
      const ext = coverFile.name.split('.').pop() ?? 'jpg'
      coverPath = `album_covers/${albumId}/${Date.now()}.${ext}`

      const { data: coverData, error: coverError } = await supabase.storage
        .from('images')
        .upload(coverPath, coverFile)
      if (coverError || !coverData) {
        logError('Album cover upload error', coverError)
        return { success: false, message: coverError?.message }
      }

      const { error: coverUpdateError } = await supabase
        .from('albums')
        .update({ cover_url: coverData.path })
        .eq('id', albumId)
      if (coverUpdateError) {
        logError('Album cover update error', coverUpdateError)
        return { success: false, message: coverUpdateError.message }
      }
      coverPath = coverData.path
    }

    // 5. For each track: upload audio first, then insert the track row
    for (let i = 0; i < tracksMeta.length; i++) {
      const meta = tracksMeta[i]
      const file = formData.get(`trackFile${i}`) as File | null

      // 5a. Upload audio file
      let trackFileName = ''
      if (file) {
        const ext = file.name.split('.').pop() ?? 'mp3'
        trackFileName = `${Date.now()}_${i}.${ext}`
        const audioPath = `albums/${albumId}/${trackFileName}`
        const { error: audioError } = await supabase.storage
          .from('audio-files')
          .upload(audioPath, file)
        if (audioError) {
          logError(`Track ${i} audio upload error`, audioError)
          return { success: false, message: audioError.message }
        }
      }

      // 5b. Parse featured artists array
      const featuredArtistIds = meta.featuredArtistIds || []

      // 5c. Insert the track row (with its audio_url)
      const { error: trackError } = await supabase
        .from('tracks')
        .insert({
          title: meta.title,
          lyrics: meta.lyrics ?? null,
          featured_artist_ids: featuredArtistIds,
          album_id: albumId,
          artist_id: mainArtistId,
          track_number: meta.trackNumber ?? i + 1,
          duration: meta.duration ?? null,
          cover_url: coverPath,
          audio_url: trackFileName,
          play_count: 0,
          like_count: 0,
          created_by: userId,
        })
      if (trackError) {
        logError(`Track ${i} insert error`, trackError)
        return { success: false, message: trackError.message }
      }
    }

    return { success: true }
  } catch (err: any) {
    logError('Upload album unexpected error', err)
    return { success: false, message: err.message }
  }
}

export default uploadAlbumAction
