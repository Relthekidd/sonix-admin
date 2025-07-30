import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// For now, let's create mock implementations to avoid import issues
// This will be replaced with real Supabase integration once the environment is configured

// Database types for type safety
export interface Track {
  id: string;
  title: string;
  artist_id: string;
  album_id?: string;
  duration?: string;
  genre?: string;
  mood?: string;
  language?: string;
  lyrics?: string;
  audio_url: string;
  cover_art_url?: string;
  play_count: number;
  created_at: string;
  updated_at: string;
  status: 'processing' | 'published' | 'failed';
  featured_artists?: string[];
  artist?: {
    name: string;
  };
}

export interface Album {
  id: string;
  title: string;
  artist_id: string;
  cover_art_url?: string;
  release_date?: string;
  description?: string;
  genre?: string;
  created_at: string;
  updated_at: string;
  track_count?: number;
}

export interface Artist {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  profile_image_url?: string;
  genre?: string;
  social_links?: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
  };
  verified: boolean;
  total_tracks: number;
  total_albums: number;
  monthly_listeners: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'listener' | 'artist' | 'admin';
  profile_image_url?: string;
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  cover_art_url?: string;
  created_by: string;
  is_featured: boolean;
  track_count: number;
  play_count: number;
  like_count: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ArtistVerificationRequest {
  id: string;
  user_id: string;
  name: string;
  email: string;
  bio?: string;
  social_links?: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
  };
  documents?: string[];
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
}

// Mock user data for development
const mockUser = {
  id: 'mock-admin-id',
  email: 'admin@sonix.com',
  user_metadata: { name: 'Admin User', role: 'admin' },
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mock Supabase client for development
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Storage helper functions
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
};

export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
};