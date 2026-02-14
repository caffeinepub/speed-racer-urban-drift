import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Home, Skull } from 'lucide-react';

interface GameOverDialogProps {
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function GameOverDialog({ onRestart, onMainMenu }: GameOverDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Card className="bg-black/90 border-red-500/50 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-red-500 flex items-center justify-center">
            <Skull className="mr-3 h-10 w-10" />
            GAME OVER
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-center text-muted-foreground">
            Your car took too much damage. Try again!
          </p>
          <Button
            onClick={onRestart}
            className="w-full h-12 neon-button"
            size="lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart Level
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
