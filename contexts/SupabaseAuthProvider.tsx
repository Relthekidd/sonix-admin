import { createContext, useContext, useEffect, useState } from 'react'
import { supabaseBrowser } from '../lib/supabase'

interface AuthContext {
  session: any
  supabase: ReturnType<typeof supabaseBrowser>
}

const Context = createContext<AuthContext | null>(null)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = supabaseBrowser()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return <Context.Provider value={{ session, supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useSupabase must be used within SupabaseAuthProvider')
  return ctx
}
