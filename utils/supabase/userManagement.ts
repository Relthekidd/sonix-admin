import { supabase } from './supabaseClient'
import type { Profile } from './supabaseClient'

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Profile
}

export const createProfile = async (profile: Partial<Profile>) => {
  const { data, error } = await supabase.from('profiles').insert(profile).single()
  if (error) throw error
  return data as Profile
}

export const deleteProfile = async (id: string) => {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
}

export const promoteUserToAdmin = async (id: string) => {
  const { error } = await supabase.rpc('promote_user_to_admin', { user_id: id })
  if (error) throw error
}

export const demoteAdminToListener = async (id: string) => {
  const { error } = await supabase.rpc('demote_admin_to_listener', { user_id: id })
  if (error) throw error
}
