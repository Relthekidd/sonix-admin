import { useState } from 'react'
import { uploadAlbumAction } from '../../app/actions/uploadAlbumAction'

export function useAlbumUpload() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const uploadAlbum = async (formData: FormData) => {
    setPending(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await uploadAlbumAction(formData)
      if (!res.success) {
        setError(res.message || 'Upload failed')
      } else {
        setSuccess(true)
      }
      return res
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      return { success: false, message: err.message }
    } finally {
      setPending(false)
    }
  }

  return { uploadAlbum, pending, error, success }
}

