import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pause, RotateCcw, Coins, Timer, Gauge, Heart, Zap, Shield } from 'lucide-react';
import { PowerUpType, type ActivePowerUp } from '../../game/powerups';

interface HUDProps {
  score: number;
  coins: number;
  timeRemaining: number;
  speed: number;
  health: number;
  nitroCharge: number;
  activePowerUps: ActivePowerUp[];
  onPause: () => void;
  onRestart: () => void;
}

export default function HUD({
  score,
  coins,
  timeRemaining,
  speed,
  health,
  nitroCharge,
  activePowerUps,
  onPause,
  onRestart
}: HUDProps) {
  const hasShield = activePowerUps.some(p => p.type === PowerUpType.SHIELD);
  const hasMagnet = activePowerUps.some(p => p.type === PowerUpType.MAGNET);

  return (
    <>
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
        <div className="space-y-2 pointer-events-auto">
          <Badge className="bg-black/80 text-neon-orange border-neon-orange/50 text-lg px-3 py-1">
            <span className="font-bold">{score.toLocaleString()}</span>
            <span className="ml-2 text-sm">pts</span>
          </Badge>
          <Badge className="bg-black/80 text-neon-cyan border-neon-cyan/50 text-lg px-3 py-1">
            <Coins className="h-4 w-4 mr-1" />
            {coins}
          </Badge>
        </div>

        <div className="space-y-2 pointer-events-auto">
          <Badge className="bg-black/80 text-neon-purple border-neon-purple/50 text-lg px-3 py-1">
            <Timer className="h-4 w-4 mr-1" />
            {Math.ceil(timeRemaining)}s
          </Badge>
          <Badge className="bg-black/80 text-neon-green border-neon-green/50 text-lg px-3 py-1">
            <Gauge className="h-4 w-4 mr-1" />
            {speed.toFixed(1)}
          </Badge>
        </div>
      </div>

      <div className="absolute top-20 left-4 space-y-2 pointer-events-none">
        <div className="bg-black/80 border border-red-500/50 rounded-lg p-2 w-48">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-red-400 flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              Health
            </span>
            <span className="text-xs font-bold text-red-400">{health}%</span>
          </div>
          <Progress value={health} className="h-2" />
        </div>

        {(hasShield || hasMagnet) && (
          <div className="space-y-1">
            {hasShield && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/50">
                <Shield className="h-3 w-3 mr-1" />
                Shield Active
              </Badge>
            )}
            {hasMagnet && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50">
                <Coins className="h-3 w-3 mr-1" />
                Magnet Active
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-black/80 border border-neon-orange/50 rounded-lg p-3 space-y-2">
          <div className="text-center">
            <Zap className="h-6 w-6 text-neon-orange mx-auto mb-1" />
            <Progress value={nitroCharge} className="h-3 w-16" />
            <span className="text-xs text-neon-orange font-bold">{Math.floor(nitroCharge)}%</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="flex space-x-2">
          <Button
            onClick={onPause}
            variant="outline"
            size="icon"
            className="border-neon-cyan/50 hover:border-neon-cyan"
          >
            <Pause className="h-5 w-5" />
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            size="icon"
            className="border-neon-orange/50 hover:border-neon-orange"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
