import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  BarChart3,
  Upload,
  Mic,
  Music,
  FolderOpen,
  Users,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../utils/auth/AuthContext";
import { ThemeToggle } from "../common/ThemeToggle";

const navigationItems = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Mic, label: "Artists", path: "/artists" },
  { icon: Music, label: "Playlists", path: "/playlists" },
  { icon: FolderOpen, label: "Uploads", path: "/uploads" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: CheckCircle, label: "Verify Artists", path: "/verify-artists" },
];

export function AdminLayout() {
  const { session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-gray-800 bg-gray-900 p-4">
        <h1 className="mb-6 px-2 text-xl font-semibold">Sonix Admin</h1>
        <nav className="flex-1 space-y-1">
          {navigationItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white border-l-4 border-purple-500"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between pt-4 text-xs">
          <span className="truncate">{session?.user?.email}</span>
          <ThemeToggle />
        </div>
      </aside>
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
