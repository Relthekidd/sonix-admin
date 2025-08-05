import { useState, useEffect, useTransition } from 'react'
import { uploadSingleAction } from '../../app/actions/upload'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { GlassCard } from '../common/GlassCard'
import { toast } from 'sonner'

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
  const [featuredArtists, setFeaturedArtists] = useState('')
  const [duration, setDuration] = useState('')
  const [published, setPublished] = useState(false)
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
    setFeaturedArtists(''); setDuration('');
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
    fd.append('featuredArtists', featuredArtists)
    fd.append('duration', duration)
    if (published) fd.append('published', 'on')

    startTransition(async () => {
      try {
        const res = await uploadSingleAction(fd)
        if (res.success) {
          toast('Uploaded successfully')
          reset()
        } else {
          toast(res.message || 'Upload failed')
        }
      } catch (err: any) {
        toast(err.message || 'Upload failed')
      }
    })
  }

  return (
    <GlassCard className="p-8">
      <form onSubmit={onSubmit} className="space-y-6 text-lg">
        <div className="space-y-3">
          <label htmlFor="title" className="text-lg font-medium">Title</label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="h-12 px-4 text-lg"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="artist" className="text-lg font-medium">Artist</label>
          <input
            id="artist"
            list="artists"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          />
          <datalist id="artists">
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </datalist>
        </div>
        <div className="space-y-3">
          <label htmlFor="audio" className="text-lg font-medium">Audio File</label>
          <input
            id="audio"
            type="file"
            accept="audio/*"
            onChange={e => e.target.files && handleAudio(e.target.files[0])}
            required
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="cover" className="text-lg font-medium">Cover Art</label>
          <input
            id="cover"
            type="file"
            accept="image/*"
            onChange={e => setCover(e.target.files?.[0] || null)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="genre" className="text-lg font-medium">Genre</label>
          <select
            id="genre"
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          >
            <option value="">Select genre</option>
            <option>Hip-Hop</option>
            <option>R&B</option>
            <option>EDM</option>
            <option>Rock</option>
            <option>Pop</option>
          </select>
        </div>
        <div className="space-y-3">
          <label htmlFor="mood" className="text-lg font-medium">Mood</label>
          <select
            id="mood"
            value={mood}
            onChange={e => setMood(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white"
          >
            <option value="">Select mood</option>
            <option>Hype</option>
            <option>Chill</option>
            <option>Romantic</option>
            <option>Dark</option>
            <option>Uplifting</option>
          </select>
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
          <label htmlFor="lyrics" className="text-lg font-medium">Lyrics</label>
          <Textarea
            id="lyrics"
            value={lyrics}
            onChange={e => setLyrics(e.target.value)}
            className="min-h-32 px-4 py-3 text-lg"
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
          <label htmlFor="featuredArtists" className="text-lg font-medium">Featured Artists</label>
          <Input
            id="featuredArtists"
            value={featuredArtists}
            onChange={e => setFeaturedArtists(e.target.value)}
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
        <button
          disabled={pending}
          className="flex items-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-lg text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
        >
          {pending && <span className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />}
          Upload
        </button>
      </form>
    </GlassCard>
  )
}
