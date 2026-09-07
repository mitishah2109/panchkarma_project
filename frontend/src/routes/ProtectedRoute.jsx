import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

/**
 * Route guard.
 *
 * <ProtectedRoute>                          -> any logged-in user
 * <ProtectedRoute allowedRoles={['ADMIN']}> -> logged-in AND role in list
 *
 * - Not logged in        -> redirect to /login, remembering where they wanted to go
 * - Logged in, wrong role -> redirect to /dashboard
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
