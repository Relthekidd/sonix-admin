import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useAuth } from "../../utils/auth/AuthContext";
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
  Menu,
} from "lucide-react";

const mainNavItems = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Mic, label: "Artists", path: "/artists" },
  { icon: Music, label: "Playlists", path: "/playlists" },
];

const contentItems = [
  { icon: FolderOpen, label: "Uploads", path: "/uploads" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: CheckCircle, label: "Verify Artists", path: "/verify-artists" },
];

const analyticsItems = [
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
];

export function AdminLayout() {
  const { session, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderNavItem = (
    item: { icon: any; label: string; path?: string },
  ) => {
    const Icon = item.icon;
    if (item.label === "Logout") {
      return (
        <button
          key={item.label}
          onClick={signOut}
          className="sonix-nav-item text-sonix-error w-full text-left"
        >
          <Icon className="w-5 h-5 text-sonix-error" />
          <span>{item.label}</span>
        </button>
      );
    }
    return (
      <NavLink
        key={item.label}
        to={item.path!}
        end={item.path === "/"}
        className={({ isActive }) =>
          `sonix-nav-item w-full text-left ${
            isActive ? "sonix-nav-item-active" : ""
          }`
        }
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen bg-sonix-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden absolute top-4 left-4 p-2 rounded-lg bg-sonix-card sonix-shadow"
      >
        <Menu className="w-5 h-5 text-sonix-primary" />
      </button>
      <div
        className={`${collapsed ? 'w-20' : 'w-72'} sonix-sidebar border-r border-sonix flex flex-col transition-all duration-300 ${!collapsed ? 'fixed z-40 inset-y-0 left-0 lg:relative' : ''}`}
      >
        <div className="p-6 border-b border-sonix flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center sonix-glow">
              <span className="text-white font-bold text-lg">🎵</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sonix-primary">Sonix</h1>
                <p className="text-xs text-sonix-secondary font-medium">Admin Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sonix-nav-item p-2 w-auto"
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <div className="p-4 border-b border-sonix">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sonix-purple rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-sonix-primary truncate">
                  {session?.user?.user_metadata?.name || 'Admin'}
                </p>
                <p className="text-xs text-sonix-secondary truncate">
                  {session?.user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-2">
            {mainNavItems.map(renderNavItem)}
          </div>
          <Separator style={{ backgroundColor: '#3F3F46' }} />
          <div className="space-y-4">
            {!collapsed && (
              <div className="px-4">
                <h3 className="text-xs font-bold text-sonix-secondary uppercase tracking-widest">Content</h3>
              </div>
            )}
            <div className="space-y-2">
              {contentItems.map(renderNavItem)}
            </div>
          </div>
          <Separator style={{ backgroundColor: '#3F3F46' }} />
          <div className="space-y-4">
            {!collapsed && (
              <div className="px-4">
                <h3 className="text-xs font-bold text-sonix-secondary uppercase tracking-widest">Insights</h3>
              </div>
            )}
            <div className="space-y-2">
              {analyticsItems.map(renderNavItem)}
            </div>
          </div>
          <Separator style={{ backgroundColor: '#3F3F46' }} />
          <div className="space-y-2">
            {renderNavItem({ icon: LogIn, label: 'Logout' })}
          </div>
        </nav>
        <div className="p-6 border-t border-sonix">
          <div className="bg-sonix-card rounded-xl p-4 text-center border border-sonix">
            <h4 className="text-sm font-bold text-sonix-primary mb-2">Upgrade Storage</h4>
            <p className="text-xs text-sonix-secondary mb-3">Get unlimited music uploads</p>
            <button className="sonix-button-primary text-xs py-2 px-4 w-full">Upgrade Now</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
