// ── app/actions/uploadAlbumAction.ts ──

import { supabaseAdmin } from '../../utils/supabase/serverClient'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'

const getSupabase = () =>
  typeof window === 'undefined' ? supabaseAdmin() : supabaseBrowser()

type Result = { success: true } | { success: false; message: string }

export async function uploadAlbumAction(formData: FormData): Promise<Result> {
  const supabase = getSupabase()

  // 1. Get the current user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) return { success: false, message: authError.message }
  const userId = authData.user!.id

  // 2. Extract album fields
  const title = formData.get('title') as string
  const mainArtistId = formData.get('mainArtistId') as string
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
  }>

  try {
    // 3. Insert the album record
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
    if (albumError || !albumData) throw new Error(albumError?.message ?? 'Failed to create album')
    const albumId = albumData.id

    // 4. Upload & set the album cover (if provided)
    let coverPath: string | null = null
    if (coverFile) {
      const ext = coverFile.name.split('.').pop() ?? 'jpg'
      coverPath = `album_covers/${albumId}/${Date.now()}.${ext}`

      const { data: coverData, error: coverError } = await supabase.storage
        .from('images')
        .upload(coverPath, coverFile)
      if (coverError) throw new Error(coverError.message)

      await supabase
        .from('albums')
        .update({ cover_url: coverData.path })
        .eq('id', albumId)
    }

    // 5. For each track: upload audio first, then insert the track row
    for (let i = 0; i < tracksMeta.length; i++) {
      const meta = tracksMeta[i]
      const file = formData.get(`trackFile${i}`) as File | null

      // 5a. Upload audio file
      let audioPath = ''
      if (file) {
        const ext = file.name.split('.').pop() ?? 'mp3'
        audioPath = `audio/${albumId}/${Date.now()}_${i}.${ext}`
        const { error: audioError } = await supabase.storage
          .from('audio-files')
          .upload(audioPath, file)
        if (audioError) throw new Error(audioError.message)
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
          track_number: i + 1,
          cover_url: coverPath,
          audio_url: audioPath,
          created_by: userId,
        })
      if (trackError) throw new Error(trackError.message)
    }

    return { success: true }
  } catch (err: any) {
    console.error('Upload album error:', err.message)
    return { success: false, message: err.message }
  }
}

export default uploadAlbumAction
