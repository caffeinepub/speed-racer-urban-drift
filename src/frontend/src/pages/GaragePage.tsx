import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Car, Lock, Check, Coins } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { CARS } from '../game/cars';
import { CarType as CarTypeEnum } from '../backend';
import { toast } from 'sonner';

export default function GaragePage() {
  const navigate = useNavigate();
  const { progress, spendCoins, unlockCar } = useProgress();

  const handlePurchase = (car: CarTypeEnum, cost: number) => {
    if (spendCoins(cost)) {
      unlockCar(car);
      toast.success(`${CARS[car].name} unlocked!`);
    } else {
      toast.error('Not enough coins!');
    }
  };

  const isUnlocked = (car: CarTypeEnum) => progress.unlockedCars.includes(car);

  return (
    <div 
      className="min-h-screen p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/assets/generated/bg-city-day.dim_1920x1080.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
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
            <Car className="inline mr-2 h-8 w-8" />
            GARAGE
          </h1>
          <div className="flex items-center space-x-2 text-neon-orange font-bold">
            <Coins className="h-5 w-5" />
            <span>{Number(progress.coins).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(CARS).map((car) => {
            const unlocked = isUnlocked(car.id);
            
            return (
              <Card 
                key={car.id}
                className={`bg-black/80 ${
                  unlocked 
                    ? 'border-neon-green/50' 
                    : 'border-muted-foreground/30'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={unlocked ? 'text-neon-green' : 'text-muted-foreground'}>
                      {car.name}
                    </CardTitle>
                    {unlocked ? (
                      <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
                        <Check className="h-4 w-4 mr-1" />
                        Owned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground/50">
                        <Lock className="h-4 w-4 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{car.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="aspect-square bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg flex items-center justify-center overflow-hidden"
                  >
                    <img 
                      src={car.sprite} 
                      alt={car.name}
                      className={`w-full h-full object-contain ${!unlocked && 'opacity-30 grayscale'}`}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Top Speed</span>
                      <span className="font-bold">{(car.stats.topSpeed * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Acceleration</span>
                      <span className="font-bold">{(car.stats.acceleration * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Handling</span>
                      <span className="font-bold">{(car.stats.handling * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {!unlocked && car.cost > 0 && (
                    <>
                      <Separator />
                      <Button
                        onClick={() => handlePurchase(car.id, car.cost)}
                        disabled={progress.coins < BigInt(car.cost)}
                        className="w-full neon-button"
                      >
                        <Coins className="mr-2 h-4 w-4" />
                        Purchase ({car.cost.toLocaleString()} coins)
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
