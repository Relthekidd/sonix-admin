/// <reference types="vite/client" />
import { createClient, type User } from '@supabase/supabase-js'

export type { User }

// Basic entity type placeholders for hooks
export type Track = any
export type Album = any
export type Artist = any
export type Playlist = any
export type ArtistVerificationRequest = any

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseBrowser = () => supabase
export const supabaseAdmin = () => createClient(supabaseUrl, serviceRoleKey)

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
