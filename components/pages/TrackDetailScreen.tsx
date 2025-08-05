import { useTracks } from '../../utils/supabase/hooks'

interface TrackDetailProps {
  trackId: string
}

export default function TrackDetailScreen({ trackId }: TrackDetailProps) {
  const { data: tracks } = useTracks()
  const track = tracks?.find(t => t.id === trackId)
  if (!track) return null

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{track.title}</h1>
      {track.featuredArtists && track.featuredArtists.length > 0 && (
        <p className="text-slate-400">
          ft. {track.featuredArtists.map((a: any) => a.name).join(' & ')}
        </p>
      )}
    </div>
  )
}
