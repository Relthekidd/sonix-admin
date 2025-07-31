import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
} from "../ui/sidebar";
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
    <SidebarProvider className="flex min-h-screen bg-background text-foreground">
      <Sidebar className="border-r border-border bg-sidebar">
        <SidebarHeader className="flex items-center justify-between">
          <h1 className="px-2 text-xl font-semibold">Sonix Admin</h1>
          <SidebarTrigger className="md:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map(({ icon: Icon, label, path }) => (
              <SidebarMenuItem key={path}>
                <NavLink to={path} end={path === "/"} className="w-full">
                  {({ isActive }) => (
                    <SidebarMenuButton asChild isActive={isActive} className="w-full">
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="truncate">{label}</span>
                      </span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between text-xs">
            <span className="truncate">{session?.user?.email}</span>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail className="bg-sidebar" />
      <SidebarInset className="p-6 overflow-y-auto">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
