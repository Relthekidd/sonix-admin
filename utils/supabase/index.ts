import { createClient } from '@supabase/supabase-js';

// Environment variables (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Main client (for browser/client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side only)
export const supabaseAdmin = () =>
  createClient(supabaseUrl, supabaseServiceRoleKey);

// --- Types ---
export interface Track { /* ...copy from client.tsx... */ }
export interface Album { /* ... */ }
export interface Artist { /* ... */ }
export interface User { /* ... */ }
export interface Playlist { /* ... */ }
export interface ArtistVerificationRequest { /* ... */ }

// --- Helpers (copy from client.tsx) ---
export const getCurrentUser = async () => { /* ... */ };
export const signIn = async (email: string, password: string) => { /* ... */ };
export const signOut = async () => { /* ... */ };
export const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  // TODO: Implement file upload logic
  return ""; // Placeholder return to satisfy the return type
};
export const getSignedUrl = async (bucket: string, path: string, expiresIn: number = 3600): Promise<string> => {
  // TODO: Implement signed URL logic
  return ""; // Placeholder return to satisfy the return type
};

// Optionally: export hooks here, or keep them in hooks.tsx and import { supabase, ... } from './index'