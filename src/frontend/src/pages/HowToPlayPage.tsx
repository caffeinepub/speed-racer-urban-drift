import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Gamepad2, Target, Coins, Shield, Zap } from 'lucide-react';

export default function HowToPlayPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/assets/generated/bg-highway.dim_1920x1080.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="ghost"
            className="text-neon-cyan"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
          <h1 className="text-4xl font-black neon-text">
            <BookOpen className="inline mr-2 h-8 w-8" />
            HOW TO PLAY
          </h1>
          <div className="w-32" />
        </div>

        <div className="space-y-4">
          <Card className="bg-black/80 border-neon-cyan/30">
            <CardHeader>
              <CardTitle className="text-neon-cyan flex items-center">
                <Gamepad2 className="mr-2 h-6 w-6" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="font-semibold text-neon-orange">Keyboard Controls:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Arrow Left/Right:</strong> Move car left or right</li>
                  <li><strong>Spacebar:</strong> Activate Nitro Boost</li>
                  <li><strong>ESC:</strong> Pause game</li>
                </ul>
              </div>
              <Separator className="bg-neon-cyan/20" />
              <div className="space-y-2">
                <p className="font-semibold text-neon-orange">Touch Controls:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>On-screen buttons:</strong> Tap left/right to steer</li>
                  <li><strong>Boost button:</strong> Tap to activate Nitro</li>
                  <li><strong>Pause button:</strong> Tap to pause</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-neon-orange/30">
            <CardHeader>
              <CardTitle className="text-neon-orange flex items-center">
                <Target className="mr-2 h-6 w-6" />
                Objective
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Complete each level before the timer runs out</li>
                <li>Collect as many coins as possible to earn points</li>
                <li>Avoid obstacles to maintain your health</li>
                <li>Use power-ups strategically to maximize your score</li>
                <li>Unlock new cars and levels by completing races</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-neon-purple/30">
            <CardHeader>
              <CardTitle className="text-neon-purple flex items-center">
                <Coins className="mr-2 h-6 w-6" />
                Collectibles & Obstacles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-neon-cyan mb-2">Coins:</p>
                <p>Collect coins to increase your score and earn currency for unlocking new cars.</p>
              </div>
              <Separator className="bg-neon-purple/20" />
              <div>
                <p className="font-semibold text-destructive mb-2">Obstacles:</p>
                <p>Avoid traffic cones, barriers, and potholes. Colliding with obstacles reduces your health. If health reaches zero, it's game over!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-neon-green/30">
            <CardHeader>
              <CardTitle className="text-neon-green flex items-center">
                <Zap className="mr-2 h-6 w-6" />
                Power-Ups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-blue-400">Shield</p>
                  <p className="text-sm">Protects you from one collision with an obstacle</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Coins className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-yellow-400">Coin Magnet</p>
                  <p className="text-sm">Automatically attracts nearby coins for a limited time</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="h-6 w-6 text-neon-orange flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-neon-orange">Nitro Boost</p>
                  <p className="text-sm">Increases your nitro charge for temporary speed boosts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-neon-cyan/30">
            <CardHeader>
              <CardTitle className="text-neon-cyan">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Plan your route ahead to collect coins while avoiding obstacles</li>
                <li>Save your nitro boost for critical moments</li>
                <li>Use the shield power-up when navigating dense obstacle areas</li>
                <li>Activate the coin magnet in coin-rich sections for maximum collection</li>
                <li>Practice makes perfect - learn each level's patterns</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
