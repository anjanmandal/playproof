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
import { HomeSessionPage } from '@/pages/dashboard/HomeSessionPage';
import EdgeVisionCoachPage from '@/pages/dashboard/EdgeVisionCoachPage';
import ResearchHubPage from '@/pages/dashboard/ResearchHubPage';
import TelePtPage from '@/pages/dashboard/TelePtPage';
import CommunityKioskPage from '@/pages/dashboard/CommunityKioskPage';
import EConsultPage from '@/pages/dashboard/EConsultPage';
import { CaseChannelPage } from '@/pages/dashboard/CaseChannelPage';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';
import { isWearableIntegrationActive } from '@/config/features';
import { WearablePage } from '@/pages/wearables/WearablePage';
import { AthleteTasksPage } from '@/pages/athletes/AthleteTasksPage';
import { CyclePrivacyPage } from '@/pages/athletes/CyclePrivacyPage';

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

const RequireRole = ({ allowed, children }: { allowed: Role[]; children: ReactElement }) => {
  const { user } = useAuth();
  if (!user || !allowed.includes(user.role)) {
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
          {isWearableIntegrationActive && <Route path="wearables" element={<WearablePage />} />}
          <Route path="risk" element={<RiskPage />} />
          <Route path="planner" element={<TeamPlannerPage />} />
          <Route path="home-session" element={<HomeSessionPage />} />
          <Route path="edge-coach" element={<EdgeVisionCoachPage />} />
          <Route path="case-channel">
            <Route
              index
              element={
                <RequireRole allowed={['COACH', 'AT_PT', 'ADMIN']}>
                  <CaseChannelPage />
                </RequireRole>
              }
            />
            <Route
              path=":athleteId"
              element={
                <RequireRole allowed={['COACH', 'AT_PT', 'ADMIN']}>
                  <CaseChannelPage />
                </RequireRole>
              }
            />
          </Route>
          <Route path="research" element={<ResearchHubPage />} />
          <Route
            path="tele-pt"
            element={
              <RequireRole allowed={['AT_PT', 'ADMIN']}>
                <TelePtPage />
              </RequireRole>
            }
          />
          <Route
            path="community-kiosk"
            element={
              <RequireRole allowed={['COACH', 'ADMIN']}>
                <CommunityKioskPage />
              </RequireRole>
            }
          />
          <Route
            path="econsult"
            element={
              <RequireRole allowed={['COACH', 'AT_PT', 'ADMIN']}>
                <EConsultPage />
              </RequireRole>
            }
          />
          <Route path="rehab" element={<RehabPage />} />
          <Route path="portal" element={<PortalPage />} />
          <Route path="athlete/tasks" element={<AthleteTasksPage />} />
          <Route path="athlete/privacy/cycle" element={<CyclePrivacyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
