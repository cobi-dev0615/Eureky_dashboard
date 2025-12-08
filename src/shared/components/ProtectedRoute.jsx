import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isTokenValid } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isTokenValid()) {
        // Redirect to login if not authenticated
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, loading, isTokenValid, navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !isTokenValid()) {
    return null;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;