import { useState, useTransition } from 'react'
import { uploadArtistAction } from '../../app/actions/upload'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { GlassCard } from '../common/GlassCard'
import { logError } from '../../utils/logger'

export function AddArtistForm({ onSuccess }: { onSuccess?: () => void }) {
  // Form state
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [genres, setGenres] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isVerified, setIsVerified] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()

  // Upload helper: uploads file to Supabase and returns public URL
  const handleUpload = async (file: File, path: string) => {
    try {
      const fileExt = file.name.split('.').pop()!
      const fileName = `${path}/${Date.now()}.${fileExt}`
      const { data: uploadData, error } = await supabaseBrowser()
        .storage
        .from('artists')
        .upload(fileName, file)

      if (error || !uploadData) {
        throw error || new Error('No data returned')
      }

      const {
        data: { publicUrl }
      } = supabaseBrowser()
        .storage
        .from('artists')
        .getPublicUrl(uploadData.path)

      return publicUrl
    } catch (err) {
      logError(`Upload error for ${path}`, err)
      throw err
    }
  }

  // Handlers for file inputs
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    try {
      const url = await handleUpload(e.target.files[0], 'avatars')
      setAvatarUrl(url)
    } catch (err) {
      setMessage('Failed to upload avatar')
    }
  }

  const onProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    try {
      const url = await handleUpload(e.target.files[0], 'profile_pictures')
      setProfilePictureUrl(url)
    } catch (err) {
      setMessage('Failed to upload profile picture')
    }
  }

  const onBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    try {
      const url = await handleUpload(e.target.files[0], 'banners')
      setImageUrl(url)
    } catch (err) {
      setMessage('Failed to upload banner image')
    }
  }

  // Form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const payload = {
          id: crypto.randomUUID(),
          name,
          bio,
          avatar_url: avatarUrl,
          profile_picture_url: profilePictureUrl,
          image_url: imageUrl,
          genres: genres
            .split(',')
            .map(g => g.trim())
            .filter(Boolean),
          is_featured: isFeatured,
          is_verified: isVerified,
          followers_count: followersCount,
        }

        const res = await uploadArtistAction(payload)
        if (res.success) {
          setMessage('Artist saved successfully')
          setName('')
          setBio('')
          setAvatarUrl('')
          setProfilePictureUrl('')
          setImageUrl('')
          setGenres('')
          setFollowersCount(0)
          setIsFeatured(false)
          setIsVerified(true)
          onSuccess?.()
        } else {
          logError('Artist save failed', res.error)
          setMessage('Failed to save artist')
        }
      } catch (err) {
        logError('Artist save error', err)
        setMessage('Failed to save artist')
      }
    })
  }

  return (
    <GlassCard className="p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {message && <p className="text-lg">{message}</p>}

        <div className="space-y-3">
          <label htmlFor="name" className="text-lg font-medium">Name</label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="h-12 px-4 text-lg"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="bio" className="text-lg font-medium">Bio</label>
          <Textarea
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="px-4 py-3 text-lg min-h-24"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="genres" className="text-lg font-medium">Genres (comma separated)</label>
          <Input
            id="genres"
            value={genres}
            onChange={e => setGenres(e.target.value)}
            className="h-12 px-4 text-lg"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="followersCount" className="text-lg font-medium">
            Follower Count (simulate)
          </label>
          <Input
            id="followersCount"
            type="number"
            min="0"
            value={followersCount}
            onChange={e => setFollowersCount(Number(e.target.value))}
            className="h-12 px-4 text-lg"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="avatar" className="text-lg font-medium">Avatar Image</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="w-full px-4 py-3 text-lg border rounded-md border-white/20 bg-white/10"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="profilePicture" className="text-lg font-medium">Profile Picture</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={onProfilePicChange}
            className="w-full px-4 py-3 text-lg border rounded-md border-white/20 bg-white/10"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="banner" className="text-lg font-medium">Banner Image</label>
          <input
            id="banner"
            type="file"
            accept="image/*"
            onChange={onBannerChange}
            className="w-full px-4 py-3 text-lg border rounded-md border-white/20 bg-white/10"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center gap-2 text-lg font-medium">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={e => setIsVerified(e.target.checked)}
              className="h-5 w-5"
            />
            Verified
          </label>
          <label className="flex items-center gap-2 text-lg font-medium">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="h-5 w-5"
            />
            Featured
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 text-lg text-white transition rounded-lg bg-white/10 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
        >
          Save Artist
        </button>
      </form>
    </GlassCard>
  )
}

export default AddArtistForm
