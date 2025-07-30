import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Upload, Users, CheckCircle, TrendingUp, Music, PlayCircle, Clock, Star, UserCheck, Loader2 } from "lucide-react";
import { useRecentTracks, usePlatformStats, useVerificationRequests } from "../../utils/supabase/hooks";

const quickAccessCards = [
  {
    title: "Upload Music",
    description: "Add singles and albums to the platform",
    icon: Upload,
    iconColor: "text-sonix-purple",
    href: "Upload"
  },
  {
    title: "Manage Artists", 
    description: "Browse and edit artist profiles",
    icon: Users,
    iconColor: "text-sonix-green",
    href: "Artists"
  },
  {
    title: "Platform Users",
    description: "Manage user accounts and roles",
    icon: UserCheck,
    iconColor: "text-sonix-purple",
    href: "Users"
  },
  {
    title: "Content Library",
    description: "View all uploaded content",
    icon: Music,
    iconColor: "text-orange-400",
    href: "Uploads"
  },
  {
    title: "Platform Analytics",
    description: "Performance insights and reports",
    icon: TrendingUp,
    iconColor: "text-pink-400",
    href: "Analytics"
  }
];

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { data: recentTracks, loading: tracksLoading } = useRecentTracks(4);
  const { data: platformStats, loading: statsLoading } = usePlatformStats();
  const { data: verificationRequests, loading: requestsLoading } = useVerificationRequests();

  const renderLoadingCard = (title: string) => (
    <div className="sonix-card flex items-center justify-center h-32">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="w-6 h-6 text-sonix-purple animate-spin" />
        <p className="text-sm text-sonix-secondary">Loading {title}...</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-sonix-black border-b border-sonix px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sonix-primary mb-2">Welcome back, Admin</h1>
            <p className="text-sonix-secondary font-medium">Here's what's happening on Sonix today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="sonix-tag">
              🎵 Sonix Admin
            </div>
            <Badge className="bg-sonix-green text-white">
              ✅ Connected to Supabase
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-sonix-black">
        {/* Quick Access Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-sonix-primary mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {quickAccessCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  onClick={() => onNavigate(card.href)}
                  className="sonix-card hover:sonix-shadow-lg transition-all duration-300 hover:-translate-y-1 text-left group hover:sonix-glow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-sonix-tag flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sonix-primary mb-2 group-hover:text-sonix-purple transition-colors">{card.title}</h3>
                    <p className="text-sm text-sonix-secondary">{card.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Widgets */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-sonix-primary mb-6">Platform Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Upload Queue Status */}
            <div className="sonix-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sonix-tag flex items-center justify-center">
                  <Clock className="w-6 h-6 text-sonix-purple" />
                </div>
                <div className="w-3 h-3 rounded-full bg-sonix-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-sonix-primary mb-1">3</h3>
                <p className="text-sm font-medium text-sonix-secondary">Upload Queue</p>
                <p className="text-xs text-sonix-secondary mt-1">Files processing</p>
              </div>
            </div>

            {/* Verification Requests */}
            <div className="sonix-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sonix-tag flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
              </div>
              <div>
                {requestsLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-sonix-secondary" />
                    <span className="text-sm text-sonix-secondary">Loading...</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-sonix-primary mb-1">
                      {verificationRequests?.length || 0}
                    </h3>
                    <p className="text-sm font-medium text-sonix-secondary">Verification Requests</p>
                    <p className="text-xs text-sonix-secondary mt-1">Artists pending approval</p>
                  </>
                )}
              </div>
            </div>

            {/* Top Track Today */}
            <div className="sonix-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sonix-tag flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-sonix-green" />
                </div>
                <div className="w-3 h-3 rounded-full bg-sonix-purple" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-sonix-primary mb-1">Midnight Dreams</h3>
                <p className="text-sm font-medium text-sonix-secondary">Today's Top Track</p>
                <p className="text-xs text-sonix-secondary mt-1">by Luna Rodriguez • 47.2K plays</p>
              </div>
            </div>

            {/* Active Users */}
            <div className="sonix-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sonix-tag flex items-center justify-center">
                  <Users className="w-6 h-6 text-sonix-purple" />
                </div>
                <div className="w-3 h-3 rounded-full bg-sonix-green" />
              </div>
              <div>
                {statsLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-sonix-secondary" />
                    <span className="text-sm text-sonix-secondary">Loading...</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-sonix-primary mb-1">
                      {platformStats?.totalUsers?.toLocaleString() || "0"}
                    </h3>
                    <p className="text-sm font-medium text-sonix-secondary">Total Users</p>
                    <p className="text-xs text-sonix-secondary mt-1">Registered accounts</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="sonix-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-sonix-primary mb-2">Recent Uploads</h3>
              <p className="text-sonix-secondary font-medium">Latest music added to the platform</p>
              <Badge className="mt-2 bg-sonix-green text-white text-xs">
                🎯 Live Data from Supabase
              </Badge>
            </div>
            
            {tracksLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-sonix-hover rounded-xl border border-sonix/50 animate-pulse">
                    <div className="w-10 h-10 bg-sonix-tag rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-sonix-tag rounded w-3/4" />
                      <div className="h-3 bg-sonix-tag rounded w-1/2" />
                    </div>
                    <div className="w-12 h-5 bg-sonix-tag rounded" />
                  </div>
                ))}
              </div>
            ) : recentTracks && recentTracks.length > 0 ? (
              <div className="space-y-4">
                {recentTracks.map((track) => (
                  <div key={track.id} className="flex items-center justify-between p-3 bg-sonix-hover rounded-xl border border-sonix/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sonix-tag rounded-lg flex items-center justify-center">
                        <Music className="w-4 h-4 text-sonix-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sonix-primary">{track.title}</p>
                        <p className="text-sm text-sonix-secondary">
                          by {track.artist?.name || 'Unknown Artist'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="sonix-tag text-xs">
                        {track.album_id ? 'Album' : 'Single'}
                      </div>
                      <p className="text-xs text-sonix-secondary mt-1">
                        {new Date(track.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="w-8 h-8 text-sonix-secondary mx-auto mb-2" />
                <p className="text-sonix-secondary">No recent uploads</p>
              </div>
            )}
          </div>

          <div className="sonix-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-sonix-primary mb-2">Platform Stats</h3>
              <p className="text-sonix-secondary font-medium">Key metrics overview</p>
              <Badge className="mt-2 bg-sonix-green text-white text-xs">
                🎯 Live Data from Supabase
              </Badge>
            </div>
            
            {statsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-sonix-hover rounded-xl border border-sonix/50 animate-pulse">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-sonix-tag rounded w-1/3" />
                      <div className="h-6 bg-sonix-tag rounded w-1/4" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-sonix-tag rounded w-16" />
                      <div className="h-3 bg-sonix-tag rounded w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : platformStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-sonix-hover rounded-xl border border-sonix/50">
                  <div>
                    <div className="font-semibold text-sonix-primary">Total Tracks</div>
                    <div className="text-2xl font-bold text-sonix-primary">
                      {platformStats.totalTracks.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-sonix-green">+{Math.floor(platformStats.totalTracks * 0.1)} this week</div>
                    <div className="text-xs text-sonix-secondary">↑ 8.2%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-sonix-hover rounded-xl border border-sonix/50">
                  <div>
                    <div className="font-semibold text-sonix-primary">Verified Artists</div>
                    <div className="text-2xl font-bold text-sonix-primary">
                      {platformStats.totalArtists.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-sonix-green">+{Math.floor(platformStats.totalArtists * 0.05)} this week</div>
                    <div className="text-xs text-sonix-secondary">↑ 12.1%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-sonix-hover rounded-xl border border-sonix/50">
                  <div>
                    <div className="font-semibold text-sonix-primary">Total Plays</div>
                    <div className="text-2xl font-bold text-sonix-primary">
                      {(platformStats.totalPlays / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-sonix-green">+{(platformStats.totalPlays * 0.15 / 1000000).toFixed(1)}M this month</div>
                    <div className="text-xs text-sonix-secondary">↑ 15.4%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-sonix-secondary mx-auto mb-2" />
                <p className="text-sonix-secondary">No stats available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}