import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProgress } from '../hooks/useProgress';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Play, Trophy, Settings, BookOpen, Car, LogOut, LogIn } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupDialog from '../components/ProfileSetupDialog';
import { SiCaffeine } from 'react-icons/si';

export default function MainMenuPage() {
  const navigate = useNavigate();
  const { progress, isLoading } = useProgress();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const hasSavedProgress = progress.lastPlayedLevel !== undefined;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/assets/generated/bg-city-day.dim_1920x1080.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black tracking-tight neon-text">
            SPEED RACER
          </h1>
          <h2 className="text-3xl font-bold text-neon-cyan">Urban Drift</h2>
          <p className="text-xl text-neon-orange italic">
            "Race through the neon streets and master ultimate drifting!"
          </p>
        </div>

        <Card className="bg-black/80 border-neon-cyan/30 backdrop-blur-sm p-8">
          <div className="space-y-4">
            <Button
              onClick={() => navigate({ to: '/game' })}
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold neon-button"
              size="lg"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
            </Button>

            <Button
              onClick={() => {
                if (hasSavedProgress && progress.lastPlayedLevel) {
                  navigate({ to: '/game', search: { level: progress.lastPlayedLevel } });
                }
              }}
              disabled={!hasSavedProgress || isLoading}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-neon-cyan/50 hover:border-neon-cyan"
              size="lg"
            >
              Continue
              {!hasSavedProgress && <span className="ml-2 text-sm">(No saved progress)</span>}
            </Button>

            <Button
              onClick={() => navigate({ to: '/garage' })}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-neon-orange/50 hover:border-neon-orange"
              size="lg"
            >
              <Car className="mr-2 h-6 w-6" />
              Garage
            </Button>

            <Button
              onClick={() => navigate({ to: '/leaderboard' })}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-neon-purple/50 hover:border-neon-purple"
              size="lg"
            >
              <Trophy className="mr-2 h-6 w-6" />
              Leaderboard
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate({ to: '/settings' })}
                variant="outline"
                className="h-12 border-muted-foreground/30"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>

              <Button
                onClick={() => navigate({ to: '/how-to-play' })}
                variant="outline"
                className="h-12 border-muted-foreground/30"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                How to Play
              </Button>
            </div>

            <div className="pt-4 border-t border-neon-cyan/20">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm text-center text-muted-foreground">
                    Logged in as {userProfile?.name || 'User'}
                  </p>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full"
                    disabled={loginStatus === 'logging-in'}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="ghost"
                  className="w-full"
                  disabled={loginStatus === 'logging-in'}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <footer className="text-center text-sm text-muted-foreground">
          <p>
            Built with <SiCaffeine className="inline h-4 w-4 text-neon-orange" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Speed Racer: Urban Drift</p>
        </footer>
      </div>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
