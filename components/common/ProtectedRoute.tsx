import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth/AuthContext';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = true
}) => {
  const { user, loading, isAdmin, error } = useAuth();
  console.log('ProtectedRoute state', { user, loading, isAdmin, error });

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

  // Show error state if there's an authentication error
  if (!loading && error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin privileges if required
  if (!loading && requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return <>{children}</>;
};
