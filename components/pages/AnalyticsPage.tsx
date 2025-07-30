import { MetricsChart } from "../MetricsChart";
import { OptimizationDonut } from "../OptimizationDonut";
import { TrendingUp, Users, Music, PlayCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AnalyticsPage() {
  const navigate = useNavigate();
  return (
    <div className="glass-page fade-in space-y-8">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      {/* Header */}
      <header className="glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Analytics</h1>
            <p className="text-sm text-dark-secondary mt-1">Deep insights into platform performance and user engagement</p>
          </div>
          <button className="dark-button-secondary gap-2 flex items-center">
            <Download className="w-4 h-4" />
            Export Analytics
          </button>
        </div>
      </header>

      <main className="glass-panel">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-dark-tag flex items-center justify-center">
                <PlayCircle className="w-7 h-7 text-blue-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-dark-positive" />
                <span className="text-sm font-bold text-dark-positive">+18.5%</span>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-dark-primary mb-2">8.2M</h3>
              <p className="text-sm font-medium text-dark-secondary">Total Streams</p>
            </div>
          </div>

          <div className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-dark-tag flex items-center justify-center">
                <Users className="w-7 h-7 text-green-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-dark-positive" />
                <span className="text-sm font-bold text-dark-positive">+12.3%</span>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-dark-primary mb-2">94.5K</h3>
              <p className="text-sm font-medium text-dark-secondary">Active Users</p>
            </div>
          </div>

          <div className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-dark-tag flex items-center justify-center">
                <Music className="w-7 h-7 text-purple-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-dark-positive" />
                <span className="text-sm font-bold text-dark-positive">+8.7%</span>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-dark-primary mb-2">1,247</h3>
              <p className="text-sm font-medium text-dark-secondary">New Tracks</p>
            </div>
          </div>

          <div className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-dark-tag flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-orange-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-dark-positive" />
                <span className="text-sm font-bold text-dark-positive">+15.2%</span>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-dark-primary mb-2">3.8min</h3>
              <p className="text-sm font-medium text-dark-secondary">Avg. Session</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <MetricsChart />
          </div>
          <div>
            <OptimizationDonut />
          </div>
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="dark-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-dark-primary mb-2">Top Genres</h3>
              <p className="text-dark-secondary font-medium">Most popular music genres by streams</p>
            </div>
            <div className="space-y-4">
              {[
                { genre: "Pop", percentage: 32, streams: "2.6M" },
                { genre: "Hip-Hop", percentage: 24, streams: "1.9M" },
                { genre: "Electronic", percentage: 18, streams: "1.5M" },
                { genre: "Rock", percentage: 15, streams: "1.2M" },
                { genre: "R&B", percentage: 11, streams: "900K" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-primary font-medium">{item.genre}</span>
                    <span className="text-dark-secondary text-sm">{item.streams}</span>
                  </div>
                  <div className="w-full bg-dark-tag rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dark-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-dark-primary mb-2">User Engagement</h3>
              <p className="text-dark-secondary font-medium">Platform activity metrics</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
                <div>
                  <div className="font-semibold text-dark-primary">Daily Active Users</div>
                  <div className="text-2xl font-bold text-dark-primary">24.8K</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-dark-positive">+5.2%</div>
                  <div className="text-xs text-dark-secondary">vs yesterday</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
                <div>
                  <div className="font-semibold text-dark-primary">Playlist Creation</div>
                  <div className="text-2xl font-bold text-dark-primary">1,247</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-dark-positive">+12.8%</div>
                  <div className="text-xs text-dark-secondary">this week</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
                <div>
                  <div className="font-semibold text-dark-primary">Avg. Listening Time</div>
                  <div className="text-2xl font-bold text-dark-primary">47min</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-dark-positive">+8.3%</div>
                  <div className="text-xs text-dark-secondary">per session</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}