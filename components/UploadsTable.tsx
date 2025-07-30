import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../lib/supabase'

interface Track {
  id: string
  title: string
  artist_id: string
  created_at: string
  status: string
}

export default function UploadsTable() {
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    supabaseBrowser().from('tracks').select('id,title,artist_id,created_at,status').then(({ data }) => {
      setTracks(data || [])
    })
  }, [])

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left">Title</th>
          <th className="text-left">Artist</th>
          <th className="text-left">Date</th>
          <th className="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map(t => (
          <tr key={t.id} className="border-b">
            <td>{t.title}</td>
            <td>{t.artist_id}</td>
            <td>{new Date(t.created_at).toLocaleDateString()}</td>
            <td>{t.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
