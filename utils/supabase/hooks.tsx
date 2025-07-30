import { useState, useEffect } from 'react';
import { supabase, Track, Album, Artist, User, Playlist, ArtistVerificationRequest } from './client';

// Generic hook for loading states
interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock data for development
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Electric Soul',
    artist_id: '1',
    audio_url: '',
    play_count: 15420,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updated_at: new Date().toISOString(),
    status: 'published',
    artist: { name: 'The Midnight Echo' }
  },
  {
    id: '2',
    title: 'Velvet Nights',
    artist_id: '2',
    audio_url: '',
    play_count: 8932,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: new Date().toISOString(),
    status: 'published',
    artist: { name: 'Sophia Kim' }
  },
  {
    id: '3',
    title: 'Urban Legends',
    artist_id: '3',
    album_id: '1',
    audio_url: '',
    play_count: 23456,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updated_at: new Date().toISOString(),
    status: 'published',
    artist: { name: 'Alex Thompson' }
  },
  {
    id: '4',
    title: 'Mountain Song',
    artist_id: '4',
    audio_url: '',
    play_count: 5432,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updated_at: new Date().toISOString(),
    status: 'published',
    artist: { name: 'River Stone' }
  }
];

const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'The Midnight Echo',
    verified: true,
    total_tracks: 12,
    total_albums: 2,
    monthly_listeners: 45000,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sophia Kim',
    verified: true,
    total_tracks: 8,
    total_albums: 1,
    monthly_listeners: 32000,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Alex Thompson',
    verified: false,
    total_tracks: 6,
    total_albums: 1,
    monthly_listeners: 18000,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z'
  },
  {
    id: '4',
    name: 'River Stone',
    verified: true,
    total_tracks: 15,
    total_albums: 3,
    monthly_listeners: 67000,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '5',
    name: 'Luna Rodriguez',
    verified: true,
    total_tracks: 20,
    total_albums: 4,
    monthly_listeners: 89000,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockVerificationRequests: ArtistVerificationRequest[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Maya Chen',
    email: 'maya.chen@email.com',
    bio: 'Indie pop artist from Seattle',
    status: 'pending',
    submitted_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    user_id: 'user2',
    name: 'David Park',
    email: 'david.park@email.com',
    bio: 'Electronic music producer',
    status: 'pending',
    submitted_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

// Tracks hooks
export const useTracks = (): UseQueryResult<Track[]> => {
  const [data, setData] = useState<Track[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from Supabase, fall back to mock data
      try {
        const { data: tracks, error } = await supabase
          .from('tracks')
          .select(`
            *,
            artist:artists(name),
            album:albums(title)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(tracks || []);
      } catch (supabaseError) {
        console.log('Using mock data for tracks');
        setData(mockTracks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
      console.error('Error fetching tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return { data, loading, error, refetch: fetchTracks };
};

export const useRecentTracks = (limit: number = 10): UseQueryResult<Track[]> => {
  const [data, setData] = useState<Track[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data: tracks, error } = await supabase
          .from('tracks')
          .select(`
            *,
            artist:artists(name)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setData(tracks || []);
      } catch (supabaseError) {
        console.log('Using mock data for recent tracks');
        setData(mockTracks.slice(0, limit));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent tracks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTracks();
  }, [limit]);

  return { data, loading, error, refetch: fetchRecentTracks };
};

// Artists hooks
export const useArtists = (): UseQueryResult<Artist[]> => {
  const [data, setData] = useState<Artist[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data: artists, error } = await supabase
          .from('artists')
          .select('*')
          .order('name');

        if (error) throw error;
        setData(artists || []);
      } catch (supabaseError) {
        console.log('Using mock data for artists');
        setData(mockArtists);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return { data, loading, error, refetch: fetchArtists };
};

// Users hooks
export const useUsers = (): UseQueryResult<User[]> => {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(users || []);
      } catch (supabaseError) {
        console.log('Using mock data for users');
        setData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { data, loading, error, refetch: fetchUsers };
};

// Playlists hooks
export const usePlaylists = (): UseQueryResult<Playlist[]> => {
  const [data, setData] = useState<Playlist[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data: playlists, error } = await supabase
          .from('playlists')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(playlists || []);
      } catch (supabaseError) {
        console.log('Using mock data for playlists');
        setData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return { data, loading, error, refetch: fetchPlaylists };
};

// Verification requests hooks
export const useVerificationRequests = (): UseQueryResult<ArtistVerificationRequest[]> => {
  const [data, setData] = useState<ArtistVerificationRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const { data: requests, error } = await supabase
          .from('artist_verification_requests')
          .select('*')
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        setData(requests || []);
      } catch (supabaseError) {
        console.log('Using mock data for verification requests');
        setData(mockVerificationRequests);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch verification requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { data, loading, error, refetch: fetchRequests };
};

// Platform stats hook
export const usePlatformStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        // Fetch multiple stats in parallel
        const [tracksResult, artistsResult, usersResult, playsResult] = await Promise.all([
          supabase.from('tracks').select('id', { count: 'exact', head: true }),
          supabase.from('artists').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('tracks').select('play_count')
        ]);

        const totalTracks = tracksResult.count || 0;
        const totalArtists = artistsResult.count || 0;
        const totalUsers = usersResult.count || 0;
        const totalPlays = playsResult.data?.reduce((sum, track) => sum + (track.play_count || 0), 0) || 0;

        setData({
          totalTracks,
          totalArtists,
          totalUsers,
          totalPlays,
          averagePlayCount: totalTracks > 0 ? Math.round(totalPlays / totalTracks) : 0
        });
      } catch (supabaseError) {
        console.log('Using mock data for platform stats');
        const mockStats = {
          totalTracks: mockTracks.length,
          totalArtists: mockArtists.length,
          totalUsers: 1247,
          totalPlays: mockTracks.reduce((sum, track) => sum + track.play_count, 0),
          averagePlayCount: Math.round(mockTracks.reduce((sum, track) => sum + track.play_count, 0) / mockTracks.length)
        };
        setData(mockStats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch platform stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { data, loading, error, refetch: fetchStats };
};

// Upload functions
export const uploadTrack = async (trackData: {
  title: string;
  artist_id: string;
  audioFile: File;
  coverArt?: File;
  genre?: string;
  mood?: string;
  language?: string;
  lyrics?: string;
  featured_artists?: string[];
}) => {
  try {
    // For demo purposes, simulate upload success
    console.log('Mock upload track:', trackData);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock track data
    return {
      id: Date.now().toString(),
      title: trackData.title,
      artist_id: trackData.artist_id,
      audio_url: 'mock-audio-url',
      cover_art_url: trackData.coverArt ? 'mock-cover-url' : null,
      genre: trackData.genre,
      mood: trackData.mood,
      language: trackData.language,
      lyrics: trackData.lyrics,
      featured_artists: trackData.featured_artists,
      status: 'processing' as const,
      play_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading track:', error);
    throw error;
  }
};

export const uploadAlbum = async (albumData: {
  title: string;
  artist_id: string;
  coverArt?: File;
  release_date?: string;
  description?: string;
  genre?: string;
  tracks: Array<{
    title: string;
    audioFile: File;
    featured_artists?: string[];
  }>;
}) => {
  try {
    // For demo purposes, simulate album upload success
    console.log('Mock upload album:', albumData);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock album data
    return {
      id: Date.now().toString(),
      title: albumData.title,
      artist_id: albumData.artist_id,
      cover_art_url: albumData.coverArt ? 'mock-album-cover-url' : null,
      release_date: albumData.release_date,
      description: albumData.description,
      genre: albumData.genre,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      track_count: albumData.tracks.length
    };
  } catch (error) {
    console.error('Error uploading album:', error);
    throw error;
  }
};