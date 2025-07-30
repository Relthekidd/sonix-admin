// types/pages.ts
export interface NavigationProps {
  onNavigate?: (page: string) => void;
}

export interface DashboardPageProps extends NavigationProps {}
export interface AnalyticsPageProps extends NavigationProps {}

// Common interfaces for your components
export interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
}

export interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface ActivityItem {
  type: string;
  title: string;
  artist: string;
  time: string;
  status: 'Processing' | 'Completed' | 'Published' | 'Failed';
}

export interface TrackItem {
  title: string;
  artist: string;
  plays: string;
  duration: string;
}

// Auth context types (if needed)
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token?: string;
}

export interface AuthContextType {
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}