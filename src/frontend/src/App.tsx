import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import LandingPage from './pages/LandingPage';
import TrendingPage from './pages/TrendingPage';
import TemplateLibraryPage from './pages/TemplateLibraryPage';
import TimelineEditorPage from './pages/TimelineEditorPage';
import VideoConfigurationPage from './pages/VideoConfigurationPage';
import ExportPage from './pages/ExportPage';
import UserAccountPage from './pages/UserAccountPage';
import Layout from './components/Layout';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import { useEffect } from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return null;
  }

  return <>{children}</>;
}

function LayoutWrapper() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {showProfileSetup && <ProfileSetupDialog />}
    </>
  );
}

function IndexPageComponent() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/trending' });
    }
  }, [identity, navigate]);

  return <LandingPage />;
}

const rootRoute = createRootRoute({
  component: LayoutWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPageComponent,
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trending',
  component: () => (
    <AuthGuard>
      <TrendingPage />
    </AuthGuard>
  ),
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: () => (
    <AuthGuard>
      <TemplateLibraryPage />
    </AuthGuard>
  ),
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$projectId',
  component: () => (
    <AuthGuard>
      <TimelineEditorPage />
    </AuthGuard>
  ),
});

const configureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configure/$topicId',
  component: () => (
    <AuthGuard>
      <VideoConfigurationPage />
    </AuthGuard>
  ),
});

const exportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/export/$projectId',
  component: () => (
    <AuthGuard>
      <ExportPage />
    </AuthGuard>
  ),
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: () => (
    <AuthGuard>
      <UserAccountPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  trendingRoute,
  templatesRoute,
  editorRoute,
  configureRoute,
  exportRoute,
  accountRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
