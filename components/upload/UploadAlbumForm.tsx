import { useState, useEffect, useTransition } from 'react'
import { uploadAlbumAction } from '../../app/actions/upload'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { GlassCard } from '../common/GlassCard'

interface Track {
  title: string
  file: File | null
  lyrics: string
  featuredArtists: string
}

export default function UploadAlbumForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([])
  const [cover, setCover] = useState<File | null>(null)
  const [releaseDate, setReleaseDate] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [published, setPublished] = useState(false)
  const [tracks, setTracks] = useState<Track[]>([{ title: '', file: null, lyrics: '', featuredArtists: '' }])
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    supabaseBrowser().from('artists').select('id,name').then(({ data }) => setArtists(data || []))
  }, [])

  const handleTrackFile = (idx: number, file: File) => {
    setTracks(tracks => tracks.map((t, i) => i === idx ? { ...t, file } : t))
  }

  const updateTrack = (idx: number, field: keyof Track, value: any) => {
    setTracks(tracks => tracks.map((t, i) => i === idx ? { ...t, [field]: value } : t))
  }

  const addTrack = () => setTracks([...tracks, { title: '', file: null, lyrics: '', featuredArtists: '' }])
  const removeTrack = (idx: number) => setTracks(tracks.filter((_, i) => i !== idx))

  const reset = () => {
    setTitle(''); setArtist(''); setCover(null); setReleaseDate(''); setGenre('');
    setDescription(''); setAlbumId(''); setPublished(false); setTracks([{ title: '', file: null, lyrics: '', featuredArtists: '' }])
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', title)
    fd.append('artist', artist)
    if (cover) fd.append('cover', cover)
    fd.append('releaseDate', releaseDate)
    fd.append('genre', genre)
    fd.append('description', description)
    fd.append('albumId', albumId)
    if (published) fd.append('published', 'on')
    fd.append('tracks', JSON.stringify(tracks.map(t => ({ title: t.title, lyrics: t.lyrics, featuredArtists: t.featuredArtists }))))
    tracks.forEach((t, idx) => {
      if (t.file) fd.append(`trackFile${idx}`, t.file)
    })

    startTransition(async () => {
      const res = await uploadAlbumAction(fd)
      if (res.success) { setMessage('Album uploaded'); reset() } else setMessage('Upload failed')
    })
  }

  return (
    <GlassCard className="p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {message && <p className="text-lg">{message}</p>}
        <div className="space-y-3">
          <label htmlFor="albumTitle" className="text-lg font-medium">Album Title</label>
          <Input
            id="albumTitle"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="h-12 px-4 text-lg"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="albumArtist" className="text-lg font-medium">Artist</label>
          <input
            id="albumArtist"
            list="album-artists"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          />
          <datalist id="album-artists">
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </datalist>
        </div>
        <div className="space-y-3">
          <label htmlFor="cover" className="text-lg font-medium">Cover</label>
          <input
            id="cover"
            type="file"
            accept="image/*"
            onChange={e => setCover(e.target.files?.[0] || null)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="releaseDate" className="text-lg font-medium">Release Date</label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="h-12 px-4 text-lg"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="genre" className="text-lg font-medium">Genre</label>
          <Input
            id="genre"
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="h-12 px-4 text-lg"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="description" className="text-lg font-medium">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="min-h-32 px-4 py-3 text-lg"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="albumId" className="text-lg font-medium">Album ID</label>
          <Input
            id="albumId"
            value={albumId}
            onChange={e => setAlbumId(e.target.value)}
            className="h-12 px-4 text-lg"
          />
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-lg font-medium">
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="h-5 w-5"
            />
            Published
          </label>
        </div>
        <div className="space-y-6">
          {tracks.map((t, idx) => (
            <div key={idx} className="space-y-6 rounded-lg border border-white/20 p-6">
              <div className="space-y-3">
                <label htmlFor={`track-title-${idx}`} className="text-lg font-medium">Track Title</label>
                <Input
                  id={`track-title-${idx}`}
                  value={t.title}
                  onChange={e => updateTrack(idx, 'title', e.target.value)}
                  required
                  className="h-12 px-4 text-lg"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor={`track-audio-${idx}`} className="text-lg font-medium">Audio</label>
                <input
                  id={`track-audio-${idx}`}
                  type="file"
                  accept="audio/*"
                  onChange={e => e.target.files && handleTrackFile(idx, e.target.files[0])}
                  required
                  className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor={`track-lyrics-${idx}`} className="text-lg font-medium">Lyrics</label>
                <Textarea
                  id={`track-lyrics-${idx}`}
                  value={t.lyrics}
                  onChange={e => updateTrack(idx, 'lyrics', e.target.value)}
                  className="min-h-32 px-4 py-3 text-lg"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor={`track-featured-${idx}`} className="text-lg font-medium">Featured Artists</label>
                <Input
                  id={`track-featured-${idx}`}
                  value={t.featuredArtists}
                  onChange={e => updateTrack(idx, 'featuredArtists', e.target.value)}
                  className="h-12 px-4 text-lg"
                />
              </div>
              {tracks.length > 1 && (
                <button type="button" className="text-lg" onClick={() => removeTrack(idx)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="text-lg" onClick={addTrack}>
            Add Track
          </button>
        </div>
        <button
          disabled={pending}
          className="rounded-lg bg-white/10 px-6 py-3 text-lg text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
        >
          Upload Album
        </button>
      </form>
    </GlassCard>
  )
}
