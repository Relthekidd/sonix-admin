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
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  const { session, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <SidebarProvider className="flex min-h-screen bg-background text-foreground">
      <Sidebar collapsible="icon" className="border-r border-border bg-sidebar transition-all duration-300">
        <SidebarHeader className="flex items-center justify-between">
          <h1 className="px-2 text-xl font-semibold">Sonix Admin</h1>
          <SidebarTrigger />
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
          <div className="flex items-center justify-center px-2 py-1 text-xs">
            <span className="truncate">{session?.user?.email}</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail className="bg-sidebar" />
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4">
          <SidebarTrigger className="lg:hidden" />
          <h2 className="text-lg font-semibold">Sonix Admin</h2>
          <div className="ml-auto flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search"
              className="w-32 sm:w-64 md:w-72"
            />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.user_metadata?.avatar_url}
                      alt={session?.user?.email}
                    />
                    <AvatarFallback>
                      {session?.user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  {session?.user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
