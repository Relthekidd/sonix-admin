import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Upload, 
  Mic, 
  Music, 
  FolderOpen, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  LogIn,
  Loader2
} from "lucide-react";
import { Separator } from "./ui/separator";
import { useAuth } from "../utils/auth/AuthContext";
import { DashboardPage } from "./pages/DashboardPage";
import { UploadPage } from "./pages/UploadPage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { PlaylistsPage } from "./pages/PlaylistsPage";
import { UploadsPage } from "./pages/UploadsPage";
import { UsersPage } from "./pages/UsersPage";
import { VerifyArtistsPage } from "./pages/VerifyArtistsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { LoginPage } from "./pages/LoginPage";

const mainNavItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Upload, label: "Upload" },
  { icon: Mic, label: "Artists" },
  { icon: Music, label: "Playlists" },
];

const contentItems = [
  { icon: FolderOpen, label: "Uploads" },
  { icon: Users, label: "Users" },
  { icon: CheckCircle, label: "Verify Artists" },
];

const analyticsItems = [
  { icon: TrendingUp, label: "Analytics" },
];

const otherItems = [
  { icon: LogIn, label: "Logout" },
];

// Define the prop interface for pages that need navigation
interface NavigationProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard() {
  const { session, loading, isAdmin, signOut } = useAuth();
  const [activePage, setActivePage] = useState("Dashboard");

  // Show loading spinner while checking auth
  if (loading) {
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

  // Show login page if not authenticated or not admin
  if (!session || !isAdmin) {
    return <LoginPage />;
  }

  const handleNavClick = async (label: string) => {
    if (label === "Logout") {
      try {
        await signOut();
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      setActivePage(label);
    }
  };

  const renderNavItem = (item: any, isActive: boolean) => {
    const Icon = item.icon;
    const isLogout = item.label === "Logout";
    
    return (
      <button
        key={item.label}
        onClick={() => handleNavClick(item.label)}
        className={`glassmorphism-nav-item w-full text-left ${
          isActive && !isLogout ? "glassmorphism-nav-active" : ""
        } ${isLogout ? "text-red-400 hover:text-red-300" : ""}`}
      >
        <div className={`glassmorphism-icon-container ${
          isActive && !isLogout ? 'glassmorphism-icon-active' : ''
        }`}>
          <Icon className={`w-5 h-5 transition-all duration-300 ${
            isActive && !isLogout ? 'text-purple-300 scale-110' : 
            isLogout ? "text-red-400" : "text-slate-400 group-hover:text-purple-300"
          }`} />
        </div>
        <span className={`font-medium transition-colors ${
          isActive && !isLogout ? 'text-white font-semibold' : 
          isLogout ? "text-red-400" : 'text-slate-300 hover:text-white'
        }`}>
          {item.label}
        </span>
        {isActive && !isLogout && (
          <div className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50" />
        )}
      </button>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardPage onNavigate={setActivePage} />;
      case "Upload":
        return <UploadPage />;
      case "Artists":
        return <ArtistsPage />;
      case "Playlists":
        return <PlaylistsPage />;
      case "Uploads":
        return <UploadsPage />;
      case "Users":
        return <UsersPage />;
      case "Verify Artists":
        return <VerifyArtistsPage />;
      case "Analytics":
        // Remove onNavigate prop since AnalyticsPage doesn't accept it
        return <AnalyticsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Enhanced Glassmorphism Sidebar */}
      <div className="w-60 glassmorphism-sidebar flex flex-col">
        {/* Logo Section with Enhanced Styling */}
        <div className="glassmorphism-header">
          <div className="flex items-center space-x-4">
            <div className="glassmorphism-logo">
              <span className="text-white font-bold text-lg relative z-10">🎵</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-400/30 to-purple-600/20 rounded-2xl animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sonix</h1>
              <p className="text-xs text-slate-400 font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced User Info */}
        <div className="glassmorphism-user-section">
          <div className="flex items-center space-x-3">
            <div className="glassmorphism-avatar">
              <span className="text-white text-sm font-semibold">
                {session.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">
                {session.user?.user_metadata?.name || 'Admin'}
              </p>
              <p className="text-slate-400 text-sm truncate">
                {session.user?.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="text-xs text-emerald-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto glassmorphism-scrollbar">
          {/* Main Navigation */}
          <div className="space-y-2">
            <div className="px-2 mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main</h3>
            </div>
            {mainNavItems.map((item) => renderNavItem(item, activePage === item.label))}
          </div>

          <div className="h-px bg-purple-600/20 mx-2" />

          {/* Content Management */}
          <div className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Content</h3>
            </div>
            <div className="space-y-2">
              {contentItems.map((item) => renderNavItem(item, activePage === item.label))}
            </div>
          </div>

          <div className="h-px bg-purple-600/20 mx-2" />

          {/* Analytics */}
          <div className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Insights</h3>
            </div>
            <div className="space-y-2">
              {analyticsItems.map((item) => renderNavItem(item, activePage === item.label))}
            </div>
          </div>

          <div className="h-px bg-purple-600/20 mx-2" />

          {/* Other */}
          <div className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Other</h3>
            </div>
            <div className="space-y-2">
              {otherItems.map((item) => renderNavItem(item, false))}
            </div>
          </div>
        </nav>

        {/* Enhanced Bottom CTA */}
        <div className="p-4">
          <div className="glassmorphism-upgrade-card">
            <div className="glassmorphism-upgrade-icon">
              <TrendingUp className="w-6 h-6 text-purple-300" />
            </div>
            <h4 className="text-white font-bold mb-2">Upgrade Storage</h4>
            <p className="text-slate-400 text-sm mb-4">Get unlimited music uploads</p>
            <button className="glassmorphism-upgrade-btn w-full flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}