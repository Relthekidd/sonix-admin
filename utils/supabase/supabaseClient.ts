import { createClient, type User } from '@supabase/supabase-js'

export type { User }

// Basic entity type placeholders for hooks
export type Track = any
export type Album = any
export type Artist = any
export type Playlist = any
export type ArtistVerificationRequest = any

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export const supabaseBrowser = () => supabase

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export const signIn = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
