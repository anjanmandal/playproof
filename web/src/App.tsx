import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, type ReactElement } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { MovementPage } from '@/pages/dashboard/MovementPage';
import { RiskPage } from '@/pages/dashboard/RiskPage';
import { RehabPage } from '@/pages/dashboard/RehabPage';
import { PortalPage } from '@/pages/dashboard/PortalPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { TeamPlannerPage } from '@/pages/dashboard/TeamPlannerPage';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { token, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <LoadingScreen label="Booting dashboard" />;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const RedirectIfAuthenticated = ({ children }: { children: ReactElement }) => {
  const { token, initializing } = useAuth();
  if (initializing) {
    return <LoadingScreen label="Checking session" />;
  }
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Suspense fallback={<LoadingScreen />}> 
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="movement" element={<MovementPage />} />
          <Route path="risk" element={<RiskPage />} />
          <Route path="planner" element={<TeamPlannerPage />} />
          <Route path="rehab" element={<RehabPage />} />
          <Route path="portal" element={<PortalPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
