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
export const supabase = {
  auth: {
    getUser: async () => {
      // Mock successful auth for development
      return { data: { user: mockUser }, error: null };
    },
    getSession: async () => {
      // Mock session for development
      return {
        data: {
          session: {
            user: mockUser,
            access_token: 'mock-token',
            expires_at: Date.now() + (60 * 60 * 1000) // 1 hour from now
          }
        },
        error: null
      };
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      // Mock sign in - check demo credentials
      if (credentials.email === 'admin@sonix.com' && credentials.password === 'admin123') {
        return {
          data: {
            user: mockUser,
            session: {
              user: mockUser,
              access_token: 'mock-token',
              expires_at: Date.now() + (60 * 60 * 1000)
            }
          },
          error: null
        };
      } else {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' }
        };
      }
    },
    signOut: async () => {
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock auth state change
      setTimeout(() => {
        callback('SIGNED_IN', {
          user: mockUser,
          access_token: 'mock-token'
        });
      }, 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: { role: 'admin' }, error: null }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({ data: [], error: null })
        })
      }),
      order: (column: string, options?: any) => ({ data: [], error: null }),
      limit: (count: number) => ({ data: [], error: null }),
      head: true,
      count: 'exact' as const
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data: { id: Date.now().toString(), ...data }, error: null })
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data: { id: value, ...data }, error: null })
        })
      })
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => ({
        data: { path: `mock/${path}` },
        error: null
      }),
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://mock-storage.com/${path}` }
      }),
      createSignedUrl: async (path: string, expiresIn: number) => ({
        data: { signedUrl: `https://mock-storage.com/${path}?signed=true` },
        error: null
      })
    }),
    listBuckets: async () => ({ data: [], error: null }),
    createBucket: async (name: string, options?: any) => ({ error: null })
  }
};

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