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
import { UploadPage } from '../components/pages/UploadPage'
import { ArtistsPage } from '../components/pages/ArtistsPage'
import { PlaylistsPage } from '../components/pages/PlaylistsPage'
import { UploadsPage } from '../components/pages/UploadsPage'
import { UsersPage } from '../components/pages/UsersPage'
import { VerifyArtistsPage } from '../components/pages/VerifyArtistsPage'
import { AnalyticsPage } from '../components/pages/AnalyticsPage'
import { AdminLayout } from '../components/layout/AdminLayout'
import { LoginPage } from '../components/pages/LoginPage'
import { UnauthorizedPage } from '../components/pages/UnauthorizedPage'
import '../styles/globals.css'
import '../styles/glassmorphism.css'

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
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="artists" element={<ArtistsPage />} />
              <Route path="playlists" element={<PlaylistsPage />} />
              <Route path="uploads" element={<UploadsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="verify-artists" element={<VerifyArtistsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  );
}

export default App;

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
