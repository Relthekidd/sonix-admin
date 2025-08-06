import { useState, useEffect } from 'react'
import { useAlbumUpload } from './useAlbumUpload'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { logError } from '../../utils/logger'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { GlassCard } from '../common/GlassCard'
import { Button } from '../ui/button'
import ArtistMultiSelect from '../common/ArtistMultiSelect'
import { toast } from 'sonner'

interface Track {
  title: string
  file: File | null
  lyrics: string
  featuredArtistIds: string[]
}

export default function UploadAlbumForm() {
  const [title, setTitle] = useState('')
  const [mainArtistId, setMainArtistId] = useState('')
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([])
  const [mainArtistName, setMainArtistName] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [releaseDate, setReleaseDate] = useState('')
  const [featuredArtistIds, setFeaturedArtistIds] = useState<string[]>([])
  const [tracks, setTracks] = useState<Track[]>([
    { title: '', file: null, lyrics: '', featuredArtistIds: [] },
  ])
  const { uploadAlbum, pending } = useAlbumUpload()
  const formValid =
    title &&
    mainArtistId &&
    tracks.every(t => t.title && t.file)

  useEffect(() => {
    supabaseBrowser().from('artists').select('id,name').then(({ data }) => setArtists(data || []))
  }, [])

  useEffect(() => {
    if (!mainArtistId) {
      setMainArtistName('')
      return
    }
    const match = artists.find(a => a.id === mainArtistId)
    if (match) {
      setMainArtistName(match.name)
    } else {
      supabaseBrowser()
        .from('artists')
        .select('name')
        .eq('id', mainArtistId)
        .single()
        .then(({ data }) => setMainArtistName(data?.name || ''))
    }
  }, [mainArtistId, artists])

  const isValidUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  const handleTrackFile = (idx: number, file: File) => {
    setTracks(tracks => tracks.map((t, i) => i === idx ? { ...t, file } : t))
  }

  const updateTrack = (idx: number, field: keyof Track, value: any) => {
    setTracks(tracks => tracks.map((t, i) => i === idx ? { ...t, [field]: value } : t))
  }

  const addTrack = () =>
    setTracks([
      ...tracks,
      { title: '', file: null, lyrics: '', featuredArtistIds: [] },
    ])
  const removeTrack = (idx: number) => setTracks(tracks.filter((_, i) => i !== idx))

  const reset = () => {
    setTitle('')
    setMainArtistId('')
    setCover(null)
    setReleaseDate('')
    setFeaturedArtistIds([])
    setTracks([{ title: '', file: null, lyrics: '', featuredArtistIds: [] }])
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidUuid(mainArtistId)) {
      toast('Invalid main artist ID')
      return
    }
    for (const id of featuredArtistIds) {
      if (!isValidUuid(id)) {
        toast('Invalid featured artist ID')
        return
      }
    }
    for (const track of tracks) {
      for (const id of track.featuredArtistIds) {
        if (!isValidUuid(id)) {
          toast('Invalid track featured artist ID')
          return
        }
      }
    }

    const fd = new FormData()
    fd.append('title', title)
    fd.append('mainArtistId', mainArtistId)
    if (cover) fd.append('cover', cover)
    fd.append('releaseDate', releaseDate)
    fd.append('featuredArtists', JSON.stringify(featuredArtistIds))
    fd.append(
      'tracks',
      JSON.stringify(
        tracks.map(t => ({
          title: t.title,
          lyrics: t.lyrics,
          featuredArtistIds: t.featuredArtistIds,
        }))
      )
    )
    tracks.forEach((t, idx) => {
      if (t.file) fd.append(`trackFile${idx}`, t.file)
    })

    try {
      const res = await uploadAlbum(fd)
      if (res.success) {
        toast('Album uploaded successfully')
        reset()
      } else {
        logError('Album upload failed', res.message)
        toast(`${res.message || 'Upload failed'} at ${new Date().toLocaleTimeString()}`)
      }
    } catch (err: any) {
      logError('Album upload error', err)
      toast(`${err.message || 'Upload failed'} at ${new Date().toLocaleTimeString()}`)
    }
  }

  return (
    <GlassCard className="p-8 h-auto min-h-[350px]">
      <form onSubmit={onSubmit} className="space-y-8 text-lg">
        <div className="space-y-4">
          <label htmlFor="albumTitle" className="text-lg font-medium">Album Title</label>
          <Input
            id="albumTitle"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="h-14 px-6 text-lg"
          />
        </div>
        <div className="space-y-4">
          <label htmlFor="albumArtist" className="text-lg font-medium">Main Artist</label>
          <input
            id="albumArtist"
            list="album-artists"
            value={mainArtistId}
            onChange={e => setMainArtistId(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-6 py-4 text-lg text-white"
          />
          <datalist id="album-artists">
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </datalist>
          {mainArtistName && (
            <p className="text-sm text-slate-400">Selected: {mainArtistName}</p>
          )}
        </div>
        <div className="space-y-4">
          <label htmlFor="cover" className="text-lg font-medium">Cover</label>
          <input
            id="cover"
            type="file"
            accept="image/*"
            onChange={e => setCover(e.target.files?.[0] || null)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-6 py-4 text-lg text-white"
          />
        </div>
        <div className="space-y-4">
          <label htmlFor="releaseDate" className="text-lg font-medium">Release Date</label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="h-14 px-6 text-lg"
          />
        </div>

        <div className="space-y-4">
          <label className="text-lg font-medium">Featured Artists</label>
          <ArtistMultiSelect
            artists={artists}
            selectedIds={featuredArtistIds}
            onChange={setFeaturedArtistIds}
            placeholder="Search artists"
          />
        </div>

        <div className="space-y-8">
          {tracks.map((t, idx) => (
            <div key={idx} className="space-y-6 rounded-lg border border-white/20 p-6">
              <div className="space-y-4">
                <label htmlFor={`track-title-${idx}`} className="text-lg font-medium">Track Title</label>
                <Input
                  id={`track-title-${idx}`}
                  value={t.title}
                  onChange={e => updateTrack(idx, 'title', e.target.value)}
                  required
                  className="h-14 px-6 text-lg"
                />
              </div>
              <div className="space-y-4">
                <label htmlFor={`track-audio-${idx}`} className="text-lg font-medium">Audio</label>
                <input
                  id={`track-audio-${idx}`}
                  type="file"
                  accept="audio/*"
                  onChange={e => e.target.files && handleTrackFile(idx, e.target.files[0])}
                  required
                  className="w-full rounded-md border border-white/20 bg-white/10 px-6 py-4 text-lg text-white"
                />
              </div>
              <div className="space-y-4">
                <label htmlFor={`track-lyrics-${idx}`} className="text-lg font-medium">Lyrics</label>
                <Textarea
                  id={`track-lyrics-${idx}`}
                  value={t.lyrics}
                  onChange={e => updateTrack(idx, 'lyrics', e.target.value)}
                  className="min-h-40 px-6 py-4 text-lg"
                />
              </div>
              <div className="space-y-4">
                <label className="text-lg font-medium">Featured Artists</label>
                <ArtistMultiSelect
                  artists={artists}
                  selectedIds={t.featuredArtistIds}
                  onChange={ids => updateTrack(idx, 'featuredArtistIds', ids)}
                  placeholder="Search artists"
                />
              </div>
              {tracks.length > 1 && (
                <Button type="button" className="text-lg" onClick={() => removeTrack(idx)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" className="text-lg" onClick={addTrack}>
            Add Track
          </Button>
        </div>
        <Button
          type="submit"
          disabled={pending || !formValid}
          className="flex items-center gap-3 rounded-lg bg-white/10 px-8 py-4 text-lg text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
        >
          {pending && <span className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />}
          Upload Album
        </Button>
      </form>
    </GlassCard>
  )
}
