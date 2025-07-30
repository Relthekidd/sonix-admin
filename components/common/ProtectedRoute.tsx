import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = true,
}) => {
  const { session, loading, isAdmin } = useAuth();
  const location = useLocation();
  console.log('ProtectedRoute state', { loading, session, isAdmin });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Verifying Access</h2>
          <p className="text-slate-400">Please wait while we authenticate your session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!loading && !session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check admin privileges if required
  if (!loading && requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return <>{children}</>;
};
