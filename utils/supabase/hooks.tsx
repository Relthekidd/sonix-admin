import { useState, useEffect } from 'react';
import {
  supabase,
  type Track,
  type Album,
  type Artist,
  type User,
  type Playlist,
  type ArtistVerificationRequest,
} from './supabaseClient';

// Generic hook for loading states
interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Tracks hooks
export const useTracks = (): UseQueryResult<Track[]> => {
  const [data, setData] = useState<Track[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    setLoading(true);
    setError(null);
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('*');
    if (error) setError(error.message);
    setData(tracks ?? null);
    setLoading(false);
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
    setLoading(true);
    setError(null);
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) setError(error.message);
    setData(tracks ?? null);
    setLoading(false);
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
    setLoading(true);
    setError(null);
    const { data: artists, error } = await supabase
      .from('artists')
      .select('*');
    if (error) setError(error.message);
    setData(artists ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return { data, loading, error, refetch: fetchArtists };
};

// Users hooks
import type { Profile } from './supabaseClient'

export const useUsers = (): UseQueryResult<Profile[]> => {
  const [data, setData] = useState<Profile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) setError(error.message);
    setData(users ?? null);
    setLoading(false);
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
    setLoading(true);
    setError(null);
    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*');
    if (error) setError(error.message);
    setData(playlists ?? null);
    setLoading(false);
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
    setLoading(true);
    setError(null);
    const { data: requests, error } = await supabase
      .from('artist_verification_requests')
      .select('*');
    if (error) setError(error.message);
    setData(requests ?? null);
    setLoading(false);
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
    setLoading(true);
    setError(null);

    // Fetch all tracks and artists
    const { data: tracks, error: tracksError } = await supabase.from('tracks').select('play_count');
    const { data: artists, error: artistsError } = await supabase.from('artists').select('id');

    if (tracksError || artistsError) {
      setError(tracksError?.message || artistsError?.message || 'Failed to fetch stats');
      setLoading(false);
      return;
    }

    const totalTracks = tracks?.length ?? 0;
    const totalArtists = artists?.length ?? 0;
    const totalPlayCount = (tracks ?? []).reduce(
      (sum: number, track: { play_count?: number }) => sum + (track.play_count || 0),
      0
    );
    const averagePlayCount = totalTracks > 0 ? Math.round(totalPlayCount / totalTracks) : 0;

    setStats({
      totalTracks,
      totalArtists,
      totalPlayCount,
      averagePlayCount,
    });
    setLoading(false);
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
