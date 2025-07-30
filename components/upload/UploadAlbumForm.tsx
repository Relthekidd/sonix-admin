import { useState, useEffect, useTransition } from 'react'
import { uploadAlbumAction } from '../../app/actions/upload'
import { supabaseBrowser } from '../../utils/supabase/client'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

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
    <form onSubmit={onSubmit} className="space-y-4">
      {message && <p className="text-sm">{message}</p>}
      <div className="sonix-form-field">
        <label>Album Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="sonix-form-field">
        <label>Artist</label>
        <input list="album-artists" value={artist} onChange={e => setArtist(e.target.value)} className="w-full border rounded px-2 py-1" />
        <datalist id="album-artists">
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </datalist>
      </div>
      <div className="sonix-form-field">
        <label>Cover</label>
        <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] || null)} />
      </div>
      <div className="sonix-form-field">
        <label>Release Date</label>
        <Input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Genre</label>
        <Input value={genre} onChange={e => setGenre(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Description</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Album ID</label>
        <Input value={albumId} onChange={e => setAlbumId(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published
        </label>
      </div>
      <div className="space-y-4">
        {tracks.map((t, idx) => (
          <div key={idx} className="p-4 border rounded space-y-2">
            <div className="sonix-form-field">
              <label>Track Title</label>
              <Input value={t.title} onChange={e => updateTrack(idx, 'title', e.target.value)} required />
            </div>
            <div className="sonix-form-field">
              <label>Audio</label>
              <input type="file" accept="audio/*" onChange={e => e.target.files && handleTrackFile(idx, e.target.files[0])} required />
            </div>
            <div className="sonix-form-field">
              <label>Lyrics</label>
              <Textarea value={t.lyrics} onChange={e => updateTrack(idx, 'lyrics', e.target.value)} />
            </div>
            <div className="sonix-form-field">
              <label>Featured Artists</label>
              <Input value={t.featuredArtists} onChange={e => updateTrack(idx, 'featuredArtists', e.target.value)} />
            </div>
            {tracks.length > 1 && (
              <button type="button" className="text-sm" onClick={() => removeTrack(idx)}>Remove</button>
            )}
          </div>
        ))}
        <button type="button" className="text-sm" onClick={addTrack}>Add Track</button>
      </div>
      <button disabled={pending} className="sonix-button-primary">Upload Album</button>
    </form>
  )
}
