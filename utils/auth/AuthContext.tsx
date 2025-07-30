import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabaseBrowser } from '../supabase/client';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = supabaseBrowser();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch the role for the given user from the users table
  const getUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role as string | null;
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(true);

      if (session?.user) {
        const role = await getUserRole(session.user.id);
        setIsAdmin(role === 'admin');
      }

      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        getUserRole(session.user.id).then((role) => {
          setIsAdmin(role === 'admin');
          setLoading(false);
        });
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    setSession(data.session);
    if (data.session?.user) {
      const role = await getUserRole(data.session.user.id);
      setIsAdmin(role === 'admin');
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ session, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
