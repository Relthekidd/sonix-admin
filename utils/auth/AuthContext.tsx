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

  // check admin flag from profiles table
  const fetchAdminStatus = async (userId: string) => {
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
    let mounted = true;
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 6000);

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        setIsAdmin(await fetchAdminStatus(data.session.user.id));
      }

      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      if (!mounted) return;
      setSession(sess);
      if (sess?.user) {
        setIsAdmin(await fetchAdminStatus(sess.user.id));
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
      setIsAdmin(await fetchAdminStatus(data.session.user.id));
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
