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

export function Dashboard() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [activePage, setActivePage] = useState("Dashboard");

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-sonix-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-sonix-purple animate-spin" />
          <p className="text-sonix-secondary">Loading Sonix Admin...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated or not admin
  if (!user || !isAdmin) {
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
        className={`sonix-nav-item w-full text-left ${
          isActive && !isLogout ? "sonix-nav-item-active" : ""
        } ${isLogout ? "text-sonix-error hover:text-red-300" : ""}`}
      >
        <Icon className={`w-5 h-5 ${
          isActive && !isLogout ? "text-sonix-primary" : 
          isLogout ? "text-sonix-error" : "text-sonix-secondary"
        }`} />
        <span>{item.label}</span>
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
        return <AnalyticsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-sonix-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-72 bg-sonix-black border-r border-sonix flex flex-col">
        {/* Logo */}
        <div className="p-8 border-b border-sonix">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center sonix-glow relative overflow-hidden">
              <span className="text-white font-bold text-lg relative z-10">🎵</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-sonix-primary">Sonix</h1>
              <p className="text-xs text-sonix-secondary font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-6 border-b border-sonix">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sonix-purple rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sonix-primary truncate">
                {user.user_metadata?.name || 'Admin'}
              </p>
              <p className="text-xs text-sonix-secondary truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-2">
            {mainNavItems.map((item) => renderNavItem(item, activePage === item.label))}
          </div>

          <Separator style={{ backgroundColor: '#3F3F46' }} />

          {/* Content Management */}
          <div className="space-y-4">
            <div className="px-4">
              <h3 className="text-xs font-bold text-sonix-secondary uppercase tracking-widest">Content</h3>
            </div>
            <div className="space-y-2">
              {contentItems.map((item) => renderNavItem(item, activePage === item.label))}
            </div>
          </div>

          <Separator style={{ backgroundColor: '#3F3F46' }} />

          {/* Analytics */}
          <div className="space-y-4">
            <div className="px-4">
              <h3 className="text-xs font-bold text-sonix-secondary uppercase tracking-widest">Insights</h3>
            </div>
            <div className="space-y-2">
              {analyticsItems.map((item) => renderNavItem(item, activePage === item.label))}
            </div>
          </div>

          <Separator style={{ backgroundColor: '#3F3F46' }} />

          {/* Other */}
          <div className="space-y-4">
            <div className="px-4">
              <h3 className="text-xs font-bold text-sonix-secondary uppercase tracking-widest">Other</h3>
            </div>
            <div className="space-y-2">
              {otherItems.map((item) => renderNavItem(item, false))}
            </div>
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="p-6 border-t border-sonix">
          <div className="bg-sonix-card rounded-xl p-4 text-center border border-sonix">
            <h4 className="text-sm font-bold text-sonix-primary mb-2">Upgrade Storage</h4>
            <p className="text-xs text-sonix-secondary mb-3">Get unlimited music uploads</p>
            <button className="sonix-button-primary text-xs py-2 px-4 w-full">
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