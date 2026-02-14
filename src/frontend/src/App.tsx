import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import MainMenuPage from './pages/MainMenuPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import HowToPlayPage from './pages/HowToPlayPage';
import GaragePage from './pages/GaragePage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => <RouterProvider router={router} />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainMenuPage
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GamePage
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage
});

const howToPlayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-to-play',
  component: HowToPlayPage
});

const garageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/garage',
  component: GaragePage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  gameRoute,
  leaderboardRoute,
  settingsRoute,
  howToPlayRoute,
  garageRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
