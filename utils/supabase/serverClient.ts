import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin can only be used on the server');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server environment variables are not set');
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

