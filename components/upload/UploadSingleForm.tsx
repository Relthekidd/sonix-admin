import { useState, useEffect, useTransition } from 'react'
import { uploadSingleAction } from '../../app/actions/upload'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export default function UploadSingleForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([])
  const [cover, setCover] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [genre, setGenre] = useState('')
  const [mood, setMood] = useState('')
  const [description, setDescription] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [featuredArtists, setFeaturedArtists] = useState('')
  const [language, setLanguage] = useState('')
  const [duration, setDuration] = useState('')
  const [published, setPublished] = useState(false)
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    supabaseBrowser()
      .from('artists')
      .select('id,name')
      .then(({ data }) => setArtists(data || []))
  }, [])

  const handleAudio = (file: File) => {
    setAudio(file)
    const audioEl = document.createElement('audio')
    audioEl.onloadedmetadata = () => {
      const min = Math.floor(audioEl.duration / 60)
      const sec = Math.floor(audioEl.duration % 60)
      setDuration(`${min}:${String(sec).padStart(2, '0')}`)
    }
    audioEl.src = URL.createObjectURL(file)
  }

  const reset = () => {
    setTitle(''); setArtist(''); setCover(null); setAudio(null); setGenre('');
    setMood(''); setDescription(''); setLyrics(''); setReleaseDate('');
    setAlbumId(''); setFeaturedArtists(''); setLanguage(''); setDuration('');
    setPublished(false)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!audio) return
    const fd = new FormData()
    fd.append('title', title)
    fd.append('artist', artist)
    if (cover) fd.append('cover', cover)
    fd.append('audio', audio)
    fd.append('genre', genre)
    fd.append('mood', mood)
    fd.append('description', description)
    fd.append('lyrics', lyrics)
    fd.append('releaseDate', releaseDate)
    fd.append('albumId', albumId)
    fd.append('featuredArtists', featuredArtists)
    fd.append('language', language)
    fd.append('duration', duration)
    if (published) fd.append('published', 'on')

    startTransition(async () => {
      try {
        const res = await uploadSingleAction(fd)
        if (res.success) {
          setMessage('Uploaded successfully')
          reset()
        } else {
          setMessage(res.message || 'Upload failed')
        }
      } catch (err: any) {
        setMessage(err.message || 'Upload failed')
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message && <p className="text-sm">{message}</p>}
      <div className="sonix-form-field">
        <label>Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="sonix-form-field">
        <label>Artist</label>
        <input list="artists" value={artist} onChange={e => setArtist(e.target.value)} className="w-full border rounded px-2 py-1" />
        <datalist id="artists">
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </datalist>
      </div>
      <div className="sonix-form-field">
        <label>Audio File</label>
        <input type="file" accept="audio/*" onChange={e => e.target.files && handleAudio(e.target.files[0])} required />
      </div>
      <div className="sonix-form-field">
        <label>Cover Art</label>
        <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] || null)} />
      </div>
      <div className="sonix-form-field">
        <label>Genre</label>
        <Input value={genre} onChange={e => setGenre(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Mood</label>
        <Input value={mood} onChange={e => setMood(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Description</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Lyrics</label>
        <Textarea value={lyrics} onChange={e => setLyrics(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Release Date</label>
        <Input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Album ID</label>
        <Input value={albumId} onChange={e => setAlbumId(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Featured Artists</label>
        <Input value={featuredArtists} onChange={e => setFeaturedArtists(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label>Language</label>
        <Input value={language} onChange={e => setLanguage(e.target.value)} />
      </div>
      <div className="sonix-form-field">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published
        </label>
      </div>
      <button disabled={pending} className="sonix-button-primary">Upload</button>
    </form>
  )
}
