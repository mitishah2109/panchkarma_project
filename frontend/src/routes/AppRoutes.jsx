import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

/** Keeps logged-in users away from /login and /register. */
function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicOnly>
            <RegisterPage />
          </PublicOnly>
        }
      />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/*
        Feature routes land here as they're built, e.g.:
        <Route path={ROUTES.APPOINTMENTS} element={
          <ProtectedRoute><AppointmentsPage /></ProtectedRoute>
        } />
      */}

      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
