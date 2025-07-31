import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useAuth } from "../../utils/auth/AuthContext";
import {
  BarChart3,
  Upload,
  Mic,
  Music,
  FolderOpen,
  Users,
  CheckCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Settings,
  Crown,
} from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";

const navigationItems = [
  { icon: BarChart3, label: "Dashboard", path: "/", color: "text-purple-400" },
  { icon: Upload, label: "Upload", path: "/upload", color: "text-emerald-400" },
  { icon: Mic, label: "Artists", path: "/artists", color: "text-blue-400" },
  { icon: Music, label: "Playlists", path: "/playlists", color: "text-orange-400" },
  { icon: FolderOpen, label: "Uploads", path: "/uploads", color: "text-yellow-400" },
  { icon: Users, label: "Users", path: "/users", color: "text-pink-400" },
  { icon: CheckCircle, label: "Verify Artists", path: "/verify-artists", color: "text-green-400" },
];

export function AdminLayout() {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      } else {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const renderNavItem = (item: typeof navigationItems[0]) => {
    const Icon = item.icon;
    
    return (
      <NavLink
        key={item.label}
        to={item.path}
        end={item.path === "/"}
        className={({ isActive }) =>
          `glassmorphism-nav-item group ${isActive ? "glassmorphism-nav-active" : ""}`
        }
      >
        {({ isActive }) => (
          <div className="flex items-center space-x-4">
            <div className={`glassmorphism-icon-container ${
              isActive ? 'glassmorphism-icon-active' : ''
            }`}>
              <Icon className={`w-5 h-5 transition-all duration-300 ${
                isActive ? 'text-purple-300 scale-110' : `${item.color} group-hover:text-purple-300 group-hover:scale-105`
              }`} />
            </div>
            {!sidebarCollapsed && (
              <span className={`font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-white font-semibold' 
                  : 'text-slate-300 group-hover:text-white'
              }`}>
                {item.label}
              </span>
            )}
            {isActive && !sidebarCollapsed && (
              <div className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50" />
            )}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Enhanced Glassmorphism Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-60'
        } glassmorphism-sidebar flex flex-col transition-all duration-500 ease-in-out py-6 ${
          mobileMenuOpen ? 'fixed z-50 inset-y-0 left-0' : 'hidden lg:flex'
        }`}
      >
        {/* Logo Header */}
        <div className="glassmorphism-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="glassmorphism-logo">
                <span className="text-white font-bold text-lg relative z-10">🎵</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-400/30 to-purple-600/20 rounded-2xl animate-pulse" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">Sonix</h1>
                  <p className="text-xs text-slate-400 font-medium">Admin Dashboard</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex glassmorphism-toggle-btn"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="glassmorphism-user-section">
          <div className="flex items-center space-x-3">
            <div className="glassmorphism-avatar">
              <span className="text-white text-sm font-bold">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {session?.user?.user_metadata?.name || 'Admin'}
                </p>
                <p className="text-slate-400 text-sm truncate">
                  {session?.user?.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                  <span className="text-xs text-emerald-400 font-medium">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto glassmorphism-scrollbar">
          {navigationItems.map(renderNavItem)}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden glassmorphism-mobile-header">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glassmorphism-mobile-toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="glassmorphism-logo-small">
              <span className="text-white font-bold text-sm">🎵</span>
            </div>
            <h1 className="text-lg font-bold text-white">Sonix Admin</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Badge className="glassmorphism-status-badge">
              <Crown className="w-3 h-3 mr-1" />
              Admin
            </Badge>
            <div className="glassmorphism-avatar-small">
              <span className="text-white text-xs font-bold">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Top Status Bar - Desktop Only */}
        <div className="hidden lg:flex glassmorphism-status-bar">
          <div className="flex items-center space-x-4 ml-auto">
            <Badge className="glassmorphism-admin-badge">
              <Crown className="w-4 h-4 mr-2" />
              Sonix Admin
            </Badge>
            <Badge className="glassmorphism-connection-badge">
              <Wifi className="w-4 h-4 mr-2" />
              Connected to Supabase
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto glassmorphism-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}