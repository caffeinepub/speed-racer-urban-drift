import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onSettings: () => void;
}

export default function PauseOverlay({ onResume, onRestart, onMainMenu, onSettings }: PauseOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Card className="bg-black/90 border-neon-cyan/50 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center neon-text">PAUSED</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onResume}
            className="w-full h-12 neon-button"
            size="lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Resume
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full h-12 border-neon-orange/50"
            size="lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart Level
          </Button>
          <Button
            onClick={onSettings}
            variant="outline"
            className="w-full h-12 border-muted-foreground/50"
            size="lg"
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
          <Button
            onClick={onMainMenu}
            variant="outline"
            className="w-full h-12 border-muted-foreground/50"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Main Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
