import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Activity,
  Eye,
  Headphones,
  Plus,
  AlertCircle
} from "lucide-react";
import { useRecentTracks, usePlatformStats, useVerificationRequests } from "../../utils/supabase/hooks";

// Define the prop interface
interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

const quickAccessCards = [
  {
    title: "Upload Music",
    description: "Add singles and albums to the platform",
    icon: Upload,
    iconColor: "text-purple-400",
    bgGradient: "from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-500/30",
    page: "Upload",
    glowColor: "shadow-purple-500/25"
  },
  {
    title: "Manage Artists", 
    description: "Browse and edit artist profiles",
    icon: Mic,
    iconColor: "text-emerald-400",
    bgGradient: "from-emerald-600/20 to-teal-600/20",
    borderColor: "border-emerald-500/30",
    page: "Artists",
    glowColor: "shadow-emerald-500/25"
  },
  {
    title: "Platform Users",
    description: "Manage user accounts and roles",
    icon: UserCheck,
    iconColor: "text-blue-400",
    bgGradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    page: "Users",
    glowColor: "shadow-blue-500/25"
  },
  {
    title: "Content Library",
    description: "View all uploaded content",
    icon: FolderOpen,
    iconColor: "text-orange-400",
    bgGradient: "from-orange-600/20 to-amber-600/20",
    borderColor: "border-orange-500/30",
    page: "Uploads",
    glowColor: "shadow-orange-500/25"
  },
  {
    title: "Platform Analytics",
    description: "Performance insights and reports",
    icon: BarChart3,
    iconColor: "text-pink-400",
    bgGradient: "from-pink-600/20 to-rose-600/20",
    borderColor: "border-pink-500/30",
    page: "Analytics",
    glowColor: "shadow-pink-500/25"
  }
];

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { data: recentTracks, loading: tracksLoading } = useRecentTracks(4);
  const { stats: platformStats, loading: statsLoading } = usePlatformStats() as {
    stats: any;
    loading: boolean;
  };
  const { data: verificationRequests, loading: requestsLoading } = useVerificationRequests();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickAccess = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    navigate(`/${page.toLowerCase()}`);
  };

  const handleVerificationClick = () => {
    if (onNavigate) {
      onNavigate("Verify Artists");
    }
    navigate("/verify-artists");
  };

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
              Here's what's happening on Sonix today • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="glassmorphism-header-stats">
            <div className="glassmorphism-live-indicator">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Live</span>
            </div>
            <div className="text-sm text-slate-400">
              {new Date().toLocaleTimeString()}
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
                    onClick={() => handleQuickAccess(card.page)}
                    className={`glassmorphism-quick-card group min-w-[280px] hover:${card.glowColor}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} flex items-center justify-center backdrop-blur-sm`}>
                        <Icon className={`w-7 h-7 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
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
            <div className="glassmorphism-status-card group hover:shadow-blue-500/25">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">ACTIVE</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">3</h3>
                <p className="text-sm font-medium text-slate-300 mb-1">Upload Queue</p>
                <p className="text-xs text-slate-500">Files processing</p>
              </div>
            </div>

            {/* Verification Requests */}
            <div 
              className="glassmorphism-status-card group hover:shadow-yellow-500/25 cursor-pointer"
              onClick={handleVerificationClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center backdrop-blur-sm">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" />
                  <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">PENDING</span>
                </div>
              </div>
              <div>
                {requestsLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span className="text-slate-400">Loading...</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {verificationRequests?.length || 0}
                    </h3>
                    <p className="text-sm font-medium text-slate-300 mb-1">Verification Requests</p>
                    <p className="text-xs text-slate-500">
                      {verificationRequests?.length ? 'Artists pending approval' : 'No pending requests'}
                    </p>
                  </>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300 mt-2 ml-auto" />
            </div>

            {/* Today's Top Track */}
            <div className="glassmorphism-status-card glassmorphism-featured-card group hover:shadow-emerald-500/25 col-span-full md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                  <PlayCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">TRENDING</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Midnight Dreams</h3>
                <p className="text-sm font-medium text-slate-300 mb-1">Today's Top Track</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>by Luna Rodriguez</span>
                  <div className="flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    <span>47.2K plays</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12%</span>
                  </div>
                </div>
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
                <Badge className="glassmorphism-live-badge px-3 py-1 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </div>
              
              <div className="glassmorphism-activity-content">
                {tracksLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-700 rounded w-3/4" />
                          <div className="h-3 bg-slate-700 rounded w-1/2" />
                        </div>
                        <div className="w-16 h-6 bg-slate-700 rounded" />
                      </div>
                    ))}
                  </div>
                ) : recentTracks && recentTracks.length > 0 ? (
                  <div className="space-y-3">
                    {recentTracks.map((track, index) => (
                      <div 
                        key={track.id} 
                        className="glassmorphism-track-item group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="glassmorphism-track-icon group-hover:bg-purple-600/30 transition-colors">
                          <Music className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="glassmorphism-track-title group-hover:text-purple-300 transition-colors">
                            {track.title}
                          </p>
                          <p className="glassmorphism-track-artist">
                            by {track.artist?.name || 'Unknown Artist'}
                          </p>
                        </div>
                        <div className="glassmorphism-track-meta">
                          <div className={`glassmorphism-track-badge ${
                            track.album_id ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'
                          }`}>
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
                      <Music className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="glassmorphism-empty-text text-slate-500">No recent uploads</p>
                    <button 
                      onClick={() => handleQuickAccess("Upload")}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Upload First Track
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="glassmorphism-activity-card">
              <div className="glassmorphism-activity-header">
                <div>
                  <h3 className="glassmorphism-activity-title">Platform Analytics</h3>
                  <p className="glassmorphism-activity-subtitle">Key metrics overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="glassmorphism-live-badge px-3 py-1 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Live Data
                  </Badge>
                  <button 
                    onClick={() => handleQuickAccess("Analytics")}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-slate-400 hover:text-purple-400" />
                  </button>
                </div>
              </div>
              
              <div className="glassmorphism-activity-content">
                {statsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-slate-700 rounded w-1/3" />
                          <div className="h-8 bg-slate-700 rounded w-1/4" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-700 rounded w-20" />
                          <div className="h-3 bg-slate-700 rounded w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : platformStats ? (
                  <div className="space-y-4">
                    <div className="glassmorphism-stat-item group">
                      <div>
                        <div className="glassmorphism-stat-label">Total Tracks</div>
                        <div className="glassmorphism-stat-value group-hover:text-purple-300 transition-colors">
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
                        <div className="glassmorphism-stat-value group-hover:text-emerald-300 transition-colors">
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
                        <div className="glassmorphism-stat-value group-hover:text-blue-300 transition-colors">
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
                      <AlertCircle className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="glassmorphism-empty-text text-slate-500">Unable to load stats</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-sm"
                    >
                      Retry
                    </button>
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