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
      // Replace with real Supabase query if needed
      setData(mockTracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
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
      // Sort by created_at descending and take the first `limit` tracks
      const sorted = [...mockTracks].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setData(sorted.slice(0, limit));
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
      setData(mockArtists);
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
      setData([]); // Replace with mockUsers if you have them
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
      setData([]); // Replace with mockPlaylists if you have them
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
      setData(mockVerificationRequests);
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
  const [stats, setStats] = useState<{
    totalTracks: number;
    totalArtists: number;
    totalPlayCount: number;
    averagePlayCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const totalTracks = mockTracks.length;
      const totalArtists = mockArtists.length;
      const totalPlayCount = mockTracks.reduce(
        (sum: number, track: Track) => sum + (track.play_count || 0),
        0
      );
      const averagePlayCount =
        totalTracks > 0 ? Math.round(totalPlayCount / totalTracks) : 0;
      setStats({
        totalTracks,
        totalArtists,
        totalPlayCount,
        averagePlayCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
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