'use server'

import { supabaseBrowser } from '../../utils/supabase/supabaseClient'
export type UploadArtistPayload = {
  name: string
  bio?: string
  avatar_url?: string
  profile_picture_url?: string
  image_url?: string
  status?: string
}

/**
 * Inserts a new artist record, setting created_by to the current user.
 */
export async function uploadArtistAction(
  payload: UploadArtistPayload
): Promise<{ success: boolean; data?: any; error?: string }> {
  // get supabase client
  const supabase = supabaseBrowser()

  // fetch current user
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError) {
    console.error('Auth fetch error:', authError.message)
    return { success: false, error: authError.message }
  }

  // insert into artists table
  const { data, error } = await supabase
    .from('artists')
    .insert([
      {
        ...payload,
        created_by: user?.id || null
      }
    ])

  if (error) {
    console.error('Artist insert error:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// default export for easy import
export default uploadArtistAction
