import { useState, useTransition } from 'react'
import { uploadArtistAction } from '../../app/actions/upload'
import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { GlassCard } from '../common/GlassCard'

export function AddArtistForm() {
  // Form state
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState('verified')
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()

  // Upload helper: uploads file to Supabase and returns public URL
  const handleUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop()!
    const fileName = `${path}/${Date.now()}.${fileExt}`
    const { data: uploadData, error } = await supabaseBrowser()
      .storage
      .from('artists')
      .upload(fileName, file)

    if (error || !uploadData) {
      console.error('Upload error:', error)
      return ''
    }

    // supabase getPublicUrl returns { data: { publicUrl: string } }
    const {
      data: { publicUrl }
    } = supabaseBrowser()
      .storage
      .from('artists')
      .getPublicUrl(uploadData.path)

    return publicUrl
  }

  // Handlers for file inputs
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const url = await handleUpload(e.target.files[0], 'avatars')
    setAvatarUrl(url)
  }

  const onProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const url = await handleUpload(e.target.files[0], 'profile_pictures')
    setProfilePictureUrl(url)
  }

  const onBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const url = await handleUpload(e.target.files[0], 'banners')
    setImageUrl(url)
  }

  // Form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const payload = {
        name,
        bio,
        avatar_url: avatarUrl,
        profile_picture_url: profilePictureUrl,
        image_url: imageUrl,
        status,
      }

      const res = await uploadArtistAction(payload)
      if (res.success) {
        setMessage('Artist saved successfully')
        // reset form
        setName('')
        setBio('')
        setAvatarUrl('')
        setProfilePictureUrl('')
        setImageUrl('')
        setStatus('verified')
      } else {
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

        <div className="space-y-3">
          <label htmlFor="status" className="text-lg font-medium">Status</label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-3 text-lg text-white border rounded-md border-white/20 bg-white/10"
          >
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
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
