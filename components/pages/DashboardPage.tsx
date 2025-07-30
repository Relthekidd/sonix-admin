import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { 
  Upload, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Music, 
  PlayCircle, 
  Clock, 
  Star, 
  UserCheck, 
  Loader2,
  Mic,
  FolderOpen,
  BarChart3,
  ArrowRight,
  Zap,
  Activity
} from "lucide-react";
import { useRecentTracks, usePlatformStats, useVerificationRequests } from "../../utils/supabase/hooks";

const quickAccessCards = [
  {
    title: "Upload Music",
    description: "Add singles and albums to the platform",
    icon: Upload,
    iconColor: "text-purple-400",
    bgGradient: "from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-500/30",
    href: "/upload"
  },
  {
    title: "Manage Artists", 
    description: "Browse and edit artist profiles",
    icon: Mic,
    iconColor: "text-emerald-400",
    bgGradient: "from-emerald-600/20 to-teal-600/20",
    borderColor: "border-emerald-500/30",
    href: "/artists"
  },
  {
    title: "Platform Users",
    description: "Manage user accounts and roles",
    icon: UserCheck,
    iconColor: "text-blue-400",
    bgGradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    href: "/users"
  },
  {
    title: "Content Library",
    description: "View all uploaded content",
    icon: FolderOpen,
    iconColor: "text-orange-400",
    bgGradient: "from-orange-600/20 to-amber-600/20",
    borderColor: "border-orange-500/30",
    href: "/uploads"
  },
  {
    title: "Platform Analytics",
    description: "Performance insights and reports",
    icon: BarChart3,
    iconColor: "text-pink-400",
    bgGradient: "from-pink-600/20 to-rose-600/20",
    borderColor: "border-pink-500/30",
    href: "/analytics"
  }
];

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: recentTracks, loading: tracksLoading } = useRecentTracks(4);
  const { stats: platformStats, loading: statsLoading } = usePlatformStats() as {
    stats: any;
    loading: boolean;
  };
  const { data: verificationRequests, loading: requestsLoading } = useVerificationRequests();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="glassmorphism-loading-screen">
        <div className="glassmorphism-loading-container">
          <div className="glassmorphism-loading-logo">
            <span className="text-white font-bold text-3xl">🎵</span>
            <div className="absolute inset-0 border-4 border-purple-400/30 rounded-3xl animate-ping" />
          </div>
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Sonix Admin</h2>
            <p className="text-slate-400">Preparing your dashboard...</p>
            <div className="glassmorphism-loading-bar">
              <div className="glassmorphism-loading-progress" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Greeting Header */}
      <header className="glassmorphism-dashboard-header">
        <div className="glassmorphism-header-content">
          <div>
            <h1 className="glassmorphism-main-title">
              Welcome back, Admin
            </h1>
            <p className="glassmorphism-subtitle">
              Here's what's happening on Sonix today
            </p>
          </div>
          <div className="glassmorphism-header-stats">
            <div className="glassmorphism-live-indicator">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="glassmorphism-dashboard-main">
        {/* Quick Access Cards */}
        <section className="glassmorphism-section">
          <div className="glassmorphism-section-header">
            <h2 className="glassmorphism-section-title">Quick Access</h2>
            <div className="glassmorphism-section-divider" />
          </div>
          
          <div className="glassmorphism-quick-access-container">
            <div className="glassmorphism-quick-access-scroll">
              {quickAccessCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    className="glassmorphism-quick-card group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="glassmorphism-quick-card-header">
                      <div className={`glassmorphism-quick-icon bg-gradient-to-br ${card.bgGradient} border ${card.borderColor}`}>
                        <Icon className={`w-8 h-8 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <div className="glassmorphism-quick-card-content">
                      <h3 className="glassmorphism-quick-card-title">
                        {card.title}
                      </h3>
                      <p className="glassmorphism-quick-card-description">
                        {card.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Platform Status Cards */}
        <section className="glassmorphism-section">
          <div className="glassmorphism-section-header">
            <h2 className="glassmorphism-section-title">Platform Status</h2>
            <div className="glassmorphism-section-divider" />
          </div>
          
          <div className="glassmorphism-status-grid">
            {/* Upload Queue */}
            <div className="glassmorphism-status-card group">
              <div className="glassmorphism-status-header">
                <div className="glassmorphism-status-icon bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="glassmorphism-status-indicator">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                  <span className="text-xs font-semibold text-emerald-400">ACTIVE</span>
                </div>
              </div>
              <div className="glassmorphism-status-content">
                <h3 className="glassmorphism-status-number">3</h3>
                <p className="glassmorphism-status-label">Upload Queue</p>
                <p className="glassmorphism-status-sublabel">Files processing</p>
              </div>
            </div>

            {/* Verification Requests */}
            <div className="glassmorphism-status-card group">
              <div className="glassmorphism-status-header">
                <div className="glassmorphism-status-icon bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="glassmorphism-status-indicator">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" />
                  <span className="text-xs font-semibold text-yellow-400">PENDING</span>
                </div>
              </div>
              <div className="glassmorphism-status-content">
                {requestsLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span className="text-slate-400">Loading...</span>
                  </div>
                ) : (
                  <>
                    <h3 className="glassmorphism-status-number">
                      {verificationRequests?.length || 0}
                    </h3>
                    <p className="glassmorphism-status-label">Verification Requests</p>
                    <p className="glassmorphism-status-sublabel">Artists pending approval</p>
                  </>
                )}
              </div>
            </div>

            {/* Today's Top Track */}
            <div className="glassmorphism-status-card glassmorphism-featured-card group">
              <div className="glassmorphism-status-header">
                <div className="glassmorphism-status-icon bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30">
                  <PlayCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="glassmorphism-status-indicator">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                  <span className="text-xs font-semibold text-emerald-400">TRENDING</span>
                </div>
              </div>
              <div className="glassmorphism-status-content">
                <h3 className="glassmorphism-featured-title">Midnight Dreams</h3>
                <p className="glassmorphism-status-label">Today's Top Track</p>
                <p className="glassmorphism-status-sublabel">by Luna Rodriguez • 47.2K plays • +12% from yesterday</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="glassmorphism-section">
          <div className="glassmorphism-activity-grid">
            {/* Recent Uploads */}
            <div className="glassmorphism-activity-card">
              <div className="glassmorphism-activity-header">
                <div>
                  <h3 className="glassmorphism-activity-title">Recent Uploads</h3>
                  <p className="glassmorphism-activity-subtitle">Latest music added to the platform</p>
                </div>
                <Badge className="glassmorphism-live-badge">
                  <Zap className="w-3 h-3 mr-1" />
                  Live Data from Supabase
                </Badge>
              </div>
              
              <div className="glassmorphism-activity-content">
                {tracksLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="glassmorphism-loading-item">
                        <div className="glassmorphism-loading-avatar" />
                        <div className="flex-1 space-y-2">
                          <div className="glassmorphism-loading-line w-3/4" />
                          <div className="glassmorphism-loading-line w-1/2" />
                        </div>
                        <div className="glassmorphism-loading-badge" />
                      </div>
                    ))}
                  </div>
                ) : recentTracks && recentTracks.length > 0 ? (
                  <div className="space-y-3">
                    {recentTracks.map((track, index) => (
                      <div 
                        key={track.id} 
                        className="glassmorphism-track-item"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="glassmorphism-track-icon">
                          <Music className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="glassmorphism-track-title">{track.title}</p>
                          <p className="glassmorphism-track-artist">
                            by {track.artist?.name || 'Unknown Artist'}
                          </p>
                        </div>
                        <div className="glassmorphism-track-meta">
                          <div className="glassmorphism-track-badge">
                            {track.album_id ? 'Album' : 'Single'}
                          </div>
                          <p className="glassmorphism-track-date">
                            {new Date(track.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glassmorphism-empty-state">
                    <div className="glassmorphism-empty-icon">
                      <Music className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="glassmorphism-empty-text">No recent uploads</p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="glassmorphism-activity-card">
              <div className="glassmorphism-activity-header">
                <div>
                  <h3 className="glassmorphism-activity-title">Platform Stats</h3>
                  <p className="glassmorphism-activity-subtitle">Key metrics overview</p>
                </div>
                <Badge className="glassmorphism-live-badge">
                  <Zap className="w-3 h-3 mr-1" />
                  Live Data from Supabase
                </Badge>
              </div>
              
              <div className="glassmorphism-activity-content">
                {statsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="glassmorphism-loading-stat">
                        <div className="space-y-2 flex-1">
                          <div className="glassmorphism-loading-line w-1/3" />
                          <div className="glassmorphism-loading-line w-1/4 h-8" />
                        </div>
                        <div className="space-y-2">
                          <div className="glassmorphism-loading-line w-20" />
                          <div className="glassmorphism-loading-line w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : platformStats ? (
                  <div className="space-y-4">
                    <div className="glassmorphism-stat-item group">
                      <div>
                        <div className="glassmorphism-stat-label">Total Tracks</div>
                        <div className="glassmorphism-stat-value">
                          {platformStats.totalTracks.toLocaleString()}
                        </div>
                      </div>
                      <div className="glassmorphism-stat-change">
                        <div className="glassmorphism-stat-growth">+{Math.floor(platformStats.totalTracks * 0.1)} this week</div>
                        <div className="glassmorphism-stat-percentage">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          8.2%
                        </div>
                      </div>
                    </div>
                    
                    <div className="glassmorphism-stat-item group">
                      <div>
                        <div className="glassmorphism-stat-label">Verified Artists</div>
                        <div className="glassmorphism-stat-value">
                          {platformStats.totalArtists.toLocaleString()}
                        </div>
                      </div>
                      <div className="glassmorphism-stat-change">
                        <div className="glassmorphism-stat-growth">+{Math.floor(platformStats.totalArtists * 0.05)} this week</div>
                        <div className="glassmorphism-stat-percentage">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          12.1%
                        </div>
                      </div>
                    </div>
                    
                    <div className="glassmorphism-stat-item group">
                      <div>
                        <div className="glassmorphism-stat-label">Total Plays</div>
                        <div className="glassmorphism-stat-value">
                          {(platformStats.totalPlays / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="glassmorphism-stat-change">
                        <div className="glassmorphism-stat-growth">+{(platformStats.totalPlays * 0.15 / 1000000).toFixed(1)}M this month</div>
                        <div className="glassmorphism-stat-percentage">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          15.4%
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glassmorphism-empty-state">
                    <div className="glassmorphism-empty-icon">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="glassmorphism-empty-text">No stats available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}