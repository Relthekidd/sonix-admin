import React from 'react'
import ReactDOM from 'react-dom/client'
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthProvider'
import { AuthProvider } from '../utils/auth/AuthContext'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { DashboardPage } from '../components/pages/DashboardPage'
import '../styles/globals.css'

function App() {
  return (
    <SupabaseAuthProvider>
      <AuthProvider>
        <ProtectedRoute requireAdmin={true}>
          <DashboardPage onNavigate={() => {}} />
        </ProtectedRoute>
      </AuthProvider>
    </SupabaseAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)