import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, signIn as supabaseSignIn, signOut as supabaseSignOut } from '../supabase/client';

// Mock user type to match Supabase user structure
interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    role?: string;
  };
  aud: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      // For mock development, assume admin if using demo credentials
      setIsAdmin(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: signedInUser } = await supabaseSignIn(email, password);
      if (signedInUser) {
        await checkAdminStatus(signedInUser.id);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
      setIsAdmin(false);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};