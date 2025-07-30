import React from 'react'
import ReactDOM from 'react-dom/client'
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthProvider'
import { AuthProvider, useAuth } from '../utils/auth/AuthContext'
import { DashboardPage } from '../components/pages/DashboardPage'
import { LoginPage } from '../components/pages/LoginPage'
import '../styles/globals.css'

function Root() {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="min-h-screen bg-sonix-black" />
  if (!user || !isAdmin) return <LoginPage />
  return <DashboardPage onNavigate={() => {}} />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SupabaseAuthProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </SupabaseAuthProvider>
  </React.StrictMode>
)
