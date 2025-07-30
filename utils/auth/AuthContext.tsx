import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  getCurrentUser,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  type User,
} from '../supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Environment-based fallback credentials (for development)
const FALLBACK_EMAIL = 'admin@sonix.com';
const FALLBACK_PASSWORD = 'admin123';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        setError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to retrieve session');
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await checkAdminStatus(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setError('Authentication service unavailable');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user ?? null);
        setError(null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      // First check if profiles table exists and has data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.log('Profile check failed, assuming admin for development:', profileError.message);
        // For development, assume admin access if profile lookup fails
        setIsAdmin(true);
        return true;
      }

      const isAdmin = profile?.role === 'admin';
      setIsAdmin(isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      // For development, assume admin access on error
      setIsAdmin(true);
      return true;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // First try Supabase authentication
      try {
        const signedInUser = await supabaseSignIn(email, password);
        if (signedInUser) {
          setUser(signedInUser);
          const admin = await checkAdminStatus(signedInUser.id);

          localStorage.setItem('sonix_admin_session', JSON.stringify({
            user: signedInUser,
            isAdmin: admin,
            timestamp: Date.now(),
          }));

          return;
        }
      } catch (supabaseError: any) {
        console.log('Supabase auth failed, trying fallback:', supabaseError.message);
        
        // Fallback to hardcoded credentials for development
        if (email === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
          // Create a mock user session for development
          const mockUser = {
            id: 'dev-admin-user',
            email: FALLBACK_EMAIL,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated'
          } as User;
          
          setUser(mockUser);
          setIsAdmin(true);
          
          // Store session in localStorage for persistence
          localStorage.setItem('sonix_admin_session', JSON.stringify({
            user: mockUser,
            isAdmin: true,
            timestamp: Date.now()
          }));
          
          console.log('Development login successful');
          return;
        }
        
        // If neither Supabase nor fallback worked, throw the original error
        throw new Error('Invalid credentials. Please check your email and password.');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      // Clear localStorage session
      localStorage.removeItem('sonix_admin_session');
      
      // Try Supabase sign out
      await supabaseSignOut();
      
      setUser(null);
      setIsAdmin(false);
      
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if Supabase signout fails, clear local state
      setUser(null);
      setIsAdmin(false);
      setError('Sign out completed with warnings');
    }
  };

  // Check for stored session on mount
  useEffect(() => {
    const checkStoredSession = () => {
      try {
        const stored = localStorage.getItem('sonix_admin_session');
        if (stored) {
          const session = JSON.parse(stored);
          const isRecent = Date.now() - session.timestamp < 24 * 60 * 60 * 1000; // 24 hours
          
          if (isRecent && session.user && session.isAdmin) {
            setUser(session.user);
            setIsAdmin(session.isAdmin);
            console.log('Restored session from localStorage');
          } else {
            localStorage.removeItem('sonix_admin_session');
          }
        }
      } catch (error) {
        console.error('Error checking stored session:', error);
        localStorage.removeItem('sonix_admin_session');
      }
    };

    // Only check stored session if no Supabase session exists
    if (!user && !loading) {
      checkStoredSession();
    }
  }, [user, loading]);

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};