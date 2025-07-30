import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Mock data for development
const mockTracks = [
  {
    id: '1',
    title: 'Electric Soul',
    artist_id: '1',
    audio_url: 'mock-audio-url-1',
    play_count: 15420,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'published',
    artist: { name: 'The Midnight Echo' }
  },
  {
    id: '2',
    title: 'Velvet Nights',
    artist_id: '2',
    audio_url: 'mock-audio-url-2',
    play_count: 8932,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    status: 'published',
    artist: { name: 'Sophia Kim' }
  }
];

const mockArtists = [
  {
    id: '1',
    name: 'The Midnight Echo',
    verified: true,
    total_tracks: 12,
    total_albums: 2,
    monthly_listeners: 45000
  },
  {
    id: '2',
    name: 'Sophia Kim',
    verified: true,
    total_tracks: 8,
    total_albums: 1,
    monthly_listeners: 32000
  },
  {
    id: '3',
    name: 'Alex Thompson',
    verified: false,
    total_tracks: 6,
    total_albums: 1,
    monthly_listeners: 18000
  }
];

// Middleware to verify admin authentication
const requireAdmin = async (c: any, next: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === 'mock-token') {
      // For development, allow mock token
      c.set('user', { id: 'mock-admin-id', email: 'admin@sonix.com' });
      await next();
      return;
    }

    return c.json({ error: 'Admin access required' }, 403);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// Health check endpoint
app.get("/make-server-5830ef41/health", (c) => {
  return c.json({ status: "ok", service: "Sonix Admin API (Development Mode)" });
});

// Authentication endpoints
app.post("/make-server-5830ef41/auth/signup", async (c) => {
  try {
    const { email, password, name, role = 'listener' } = await c.req.json();

    // Mock user creation
    const mockUser = {
      id: Date.now().toString(),
      email,
      user_metadata: { name, role },
      created_at: new Date().toISOString()
    };

    return c.json({ user: mockUser, message: 'User created successfully (mock)' });
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Platform analytics endpoint
app.get("/make-server-5830ef41/analytics/platform", requireAdmin, async (c) => {
  try {
    return c.json({
      stats: {
        totalTracks: mockTracks.length,
        totalArtists: mockArtists.length,
        totalUsers: 1247,
      },
      recentTracks: mockTracks,
      topTracks: mockTracks.sort((a, b) => b.play_count - a.play_count)
    });
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Track management endpoints
app.get("/make-server-5830ef41/tracks", requireAdmin, async (c) => {
  try {
    return c.json({ tracks: mockTracks });
  } catch (error) {
    console.error('Tracks fetch error:', error);
    return c.json({ error: 'Failed to fetch tracks' }, 500);
  }
});

app.put("/make-server-5830ef41/tracks/:id/status", requireAdmin, async (c) => {
  try {
    const trackId = c.req.param('id');
    const { status } = await c.req.json();

    // Mock track status update
    const track = mockTracks.find(t => t.id === trackId);
    if (track) {
      track.status = status as any;
      track.updated_at = new Date().toISOString();
    }

    return c.json({ track });
  } catch (error) {
    console.error('Track status update error:', error);
    return c.json({ error: 'Failed to update track status' }, 500);
  }
});

// Artist management endpoints
app.get("/make-server-5830ef41/artists", requireAdmin, async (c) => {
  try {
    return c.json({ artists: mockArtists });
  } catch (error) {
    console.error('Artists fetch error:', error);
    return c.json({ error: 'Failed to fetch artists' }, 500);
  }
});

app.post("/make-server-5830ef41/artists", requireAdmin, async (c) => {
  try {
    const artistData = await c.req.json();
    
    const newArtist = {
      id: Date.now().toString(),
      ...artistData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockArtists.push(newArtist);
    return c.json({ artist: newArtist });
  } catch (error) {
    console.error('Artist creation error:', error);
    return c.json({ error: 'Failed to create artist' }, 500);
  }
});

// User management endpoints
app.get("/make-server-5830ef41/users", requireAdmin, async (c) => {
  try {
    const mockUsers = [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'John Doe',
        role: 'listener',
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        email: 'artist@example.com',
        name: 'Jane Artist',
        role: 'artist',
        status: 'active',
        created_at: new Date().toISOString()
      }
    ];

    return c.json({ users: mockUsers });
  } catch (error) {
    console.error('Users fetch error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Artist verification endpoints
app.get("/make-server-5830ef41/verification-requests", requireAdmin, async (c) => {
  try {
    const mockRequests = [
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

    return c.json({ requests: mockRequests });
  } catch (error) {
    console.error('Verification requests fetch error:', error);
    return c.json({ error: 'Failed to fetch verification requests' }, 500);
  }
});

// Playlist management endpoints
app.get("/make-server-5830ef41/playlists", requireAdmin, async (c) => {
  try {
    const mockPlaylists = [
      {
        id: '1',
        title: 'Featured Hits',
        description: 'Top tracks this month',
        is_featured: true,
        track_count: 25,
        play_count: 156789,
        created_at: new Date().toISOString()
      }
    ];

    return c.json({ playlists: mockPlaylists });
  } catch (error) {
    console.error('Playlists fetch error:', error);
    return c.json({ error: 'Failed to fetch playlists' }, 500);
  }
});

Deno.serve(app.fetch);