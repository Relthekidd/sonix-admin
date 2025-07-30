import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthProvider'
import { AuthProvider } from '../utils/auth/AuthContext'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { DashboardPage } from '../components/pages/DashboardPage'
import { LoginPage } from '../components/pages/LoginPage'
import { UnauthorizedPage } from '../components/pages/UnauthorizedPage'
import '../styles/globals.css'

function App() {
  return (
    <BrowserRouter>
      <SupabaseAuthProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardPage onNavigate={() => {}} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  );
}

const container = document.getElementById('root') as HTMLElement;
const existingRoot = (container as any)._reactRoot as ReactDOM.Root | undefined;
const root = existingRoot ?? ReactDOM.createRoot(container);
if (!existingRoot) {
  (container as any)._reactRoot = root;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
