import { createClient } from '@supabase/supabase-js'

// Support both process.env and Vite style import.meta.env variables so the
// client doesn't crash when the environment variables are missing during
// local development.
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  (import.meta as any).env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase environment variables are not set')
}

export const supabaseAdmin = () => createClient(supabaseUrl, serviceRoleKey)

