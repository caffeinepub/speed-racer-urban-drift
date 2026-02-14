import { useGetProgress, useSaveProgress } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import { useEffect, useState } from 'react';
import type { PlayerProgress, Level, CarType, Upgrade } from '../backend';
import { CarType as CarTypeEnum, Level as LevelEnum } from '../backend';

const DEFAULT_PROGRESS: PlayerProgress = {
  coins: BigInt(0),
  unlockedCars: [CarTypeEnum.basic],
  unlockedUpgrades: [],
  unlockedLevels: [LevelEnum.city_streets],
  lastPlayedLevel: LevelEnum.city_streets,
  settings: { sound: true, music: true }
};

const LOCAL_STORAGE_KEY = 'speedRacerProgress';

export function useProgress() {
  const { identity } = useInternetIdentity();
  const { data: backendProgress, isLoading } = useGetProgress();
  const { mutate: saveToBackend } = useSaveProgress();
  const [localProgress, setLocalProgress] = useState<PlayerProgress | null>(null);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalProgress({
            ...parsed,
            coins: BigInt(parsed.coins || 0)
          });
        } catch (e) {
          setLocalProgress(DEFAULT_PROGRESS);
        }
      } else {
        setLocalProgress(DEFAULT_PROGRESS);
      }
    }
  }, [isAuthenticated]);

  const progress = isAuthenticated ? (backendProgress || DEFAULT_PROGRESS) : (localProgress || DEFAULT_PROGRESS);

  const updateProgress = (updates: Partial<PlayerProgress>) => {
    const newProgress = { ...progress, ...updates };
    
    if (isAuthenticated) {
      saveToBackend(newProgress);
    } else {
      setLocalProgress(newProgress);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...newProgress,
        coins: newProgress.coins.toString()
      }));
    }
  };

  const addCoins = (amount: number) => {
    updateProgress({ coins: progress.coins + BigInt(amount) });
  };

  const spendCoins = (amount: number) => {
    if (progress.coins >= BigInt(amount)) {
      updateProgress({ coins: progress.coins - BigInt(amount) });
      return true;
    }
    return false;
  };

  const unlockLevel = (level: Level) => {
    if (!progress.unlockedLevels.includes(level)) {
      updateProgress({
        unlockedLevels: [...progress.unlockedLevels, level]
      });
    }
  };

  const unlockCar = (car: CarType) => {
    if (!progress.unlockedCars.includes(car)) {
      updateProgress({
        unlockedCars: [...progress.unlockedCars, car]
      });
    }
  };

  const unlockUpgrade = (upgrade: Upgrade) => {
    if (!progress.unlockedUpgrades.includes(upgrade)) {
      updateProgress({
        unlockedUpgrades: [...progress.unlockedUpgrades, upgrade]
      });
    }
  };

  const setLastPlayedLevel = (level: Level) => {
    updateProgress({ lastPlayedLevel: level });
  };

  return {
    progress,
    isLoading,
    updateProgress,
    addCoins,
    spendCoins,
    unlockLevel,
    unlockCar,
    unlockUpgrade,
    setLastPlayedLevel
  };
}
