import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trophy, Coins, ArrowRight, Home } from 'lucide-react';

interface LevelCompleteDialogProps {
  score: number;
  coins: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
  onComplete: () => void;
}

export default function LevelCompleteDialog({
  score,
  coins,
  onNextLevel,
  onMainMenu,
  onComplete
}: LevelCompleteDialogProps) {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Card className="bg-black/90 border-neon-green/50 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-neon-green flex items-center justify-center">
            <Trophy className="mr-3 h-10 w-10" />
            LEVEL COMPLETE!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xl">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-neon-orange">{score.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xl">
              <span className="text-muted-foreground flex items-center">
                <Coins className="h-5 w-5 mr-2" />
                Coins:
              </span>
              <span className="font-bold text-neon-cyan">{coins}</span>
            </div>
          </div>

          <Separator className="bg-neon-green/20" />

          <div className="space-y-3">
            <Button
              onClick={onNextLevel}
              className="w-full h-12 neon-button"
              size="lg"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Next Level
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
