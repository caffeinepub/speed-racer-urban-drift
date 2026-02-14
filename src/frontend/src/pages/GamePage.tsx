import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GameEngine } from '../game/engine';
import { GameRenderer } from '../game/render';
import { LEVELS, LEVEL_ORDER, getNextLevel } from '../game/levels';
import { CARS } from '../game/cars';
import { useProgress } from '../hooks/useProgress';
import { preloadAllAssets } from '../game/assets';
import { useSettings } from '../hooks/useSettings';
import { useSubmitScore } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import HUD from '../components/game/HUD';
import TouchControls from '../components/game/TouchControls';
import PauseOverlay from '../components/game/PauseOverlay';
import LevelCompleteDialog from '../components/game/LevelCompleteDialog';
import GameOverDialog from '../components/game/GameOverDialog';
import { toast } from 'sonner';
import { POWER_UP_DESCRIPTIONS } from '../game/powerups';
import { Level as LevelEnum, CarType as CarTypeEnum } from '../backend';

export default function GamePage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  const { progress, addCoins, unlockLevel, unlockCar, setLastPlayedLevel } = useProgress();
  const { settings } = useSettings();
  const { mutate: submitScore } = useSubmitScore();
  const { identity } = useInternetIdentity();

  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameState, setGameState] = useState<any>(null);

  const currentLevel = LEVELS[LevelEnum.city_streets];
  const currentCar = CARS[progress.unlockedCars[0] || CarTypeEnum.basic];

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 600;

      try {
        const images = await preloadAllAssets();
        
        if (!mounted) return;

        const engine = new GameEngine(currentLevel, currentCar, canvas.width, canvas.height);
        const renderer = new GameRenderer(ctx, images, currentLevel, currentCar);

        engineRef.current = engine;
        rendererRef.current = renderer;

        engine.start();
        setIsLoading(false);

        const gameLoop = (time: number) => {
          if (!mounted || !engineRef.current || !rendererRef.current) return;

          const state = engineRef.current.update(time);
          rendererRef.current.render(state);
          setGameState(state);

          if (state.state === 'complete') {
            setShowLevelComplete(true);
            return;
          }

          if (state.state === 'gameover') {
            setShowGameOver(true);
            return;
          }

          if (state.state === 'running') {
            animationFrameRef.current = requestAnimationFrame(gameLoop);
          }
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (gameState?.activePowerUps) {
      gameState.activePowerUps.forEach((powerUp: any) => {
        const description = POWER_UP_DESCRIPTIONS[powerUp.type];
        if (description) {
          toast.success(description, { duration: 2000 });
        }
      });
    }
  }, [gameState?.activePowerUps?.length]);

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
      setIsPaused(false);
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      const gameLoop = (time: number) => {
        if (!engineRef.current || !rendererRef.current) return;
        const state = engineRef.current.update(time);
        rendererRef.current.render(state);
        setGameState(state);
        if (state.state === 'running') {
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        }
      };
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restart();
      setIsPaused(false);
      setShowGameOver(false);
      setShowLevelComplete(false);
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      const gameLoop = (time: number) => {
        if (!engineRef.current || !rendererRef.current) return;
        const state = engineRef.current.update(time);
        rendererRef.current.render(state);
        setGameState(state);
        if (state.state === 'running') {
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        }
      };
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleBoost = () => {
    if (engineRef.current) {
      const input = engineRef.current.getInput();
      input.setTouchInput(false, false, true);
      setTimeout(() => input.setTouchInput(false, false, false), 100);
    }
  };

  const handleLevelComplete = () => {
    if (gameState) {
      addCoins(gameState.coinsCollected * 10);
      const score = gameState.score;
      
      if (identity) {
        submitScore({ score: BigInt(score), level: currentLevel.id });
      }

      const nextLevel = getNextLevel(currentLevel.id);
      if (nextLevel) {
        unlockLevel(nextLevel);
      }

      const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel.id);
      if (currentLevelIndex >= 0 && currentLevelIndex < LEVEL_ORDER.length - 1) {
        const carUnlocks = [CarTypeEnum.sports, CarTypeEnum.muscle, CarTypeEnum.drift, CarTypeEnum.supercar];
        if (currentLevelIndex < carUnlocks.length) {
          unlockCar(carUnlocks[currentLevelIndex]);
        }
      }

      setLastPlayedLevel(currentLevel.id);
    }
  };

  const handleNextLevel = () => {
    const nextLevel = getNextLevel(currentLevel.id);
    if (nextLevel) {
      navigate({ to: '/game', search: { level: nextLevel } });
    } else {
      navigate({ to: '/' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold neon-text">Loading...</div>
          <div className="text-neon-cyan">Preparing your race</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-neon-cyan rounded-lg shadow-neon"
        />
        
        {gameState && (
          <HUD
            score={gameState.score}
            coins={gameState.coinsCollected}
            timeRemaining={gameState.timeRemaining}
            speed={gameState.player.speed}
            health={gameState.player.health}
            nitroCharge={gameState.nitroCharge}
            activePowerUps={gameState.activePowerUps}
            onPause={handlePause}
            onRestart={handleRestart}
          />
        )}

        {settings.controls !== 'keyboard' && (
          <TouchControls
            onBoost={handleBoost}
            onLeft={() => engineRef.current?.getInput().setTouchInput(true, false, false)}
            onRight={() => engineRef.current?.getInput().setTouchInput(false, true, false)}
            onRelease={() => engineRef.current?.getInput().setTouchInput(false, false, false)}
          />
        )}
      </div>

      {isPaused && (
        <PauseOverlay
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={() => navigate({ to: '/' })}
          onSettings={() => navigate({ to: '/settings' })}
        />
      )}

      {showLevelComplete && gameState && (
        <LevelCompleteDialog
          score={gameState.score}
          coins={gameState.coinsCollected}
          onNextLevel={handleNextLevel}
          onMainMenu={() => navigate({ to: '/' })}
          onComplete={handleLevelComplete}
        />
      )}

      {showGameOver && (
        <GameOverDialog
          onRestart={handleRestart}
          onMainMenu={() => navigate({ to: '/' })}
        />
      )}
    </div>
  );
}
