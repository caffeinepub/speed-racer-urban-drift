import { Level as LevelEnum } from '../backend';
import { ASSETS } from './assets';

export interface LevelConfig {
  id: LevelEnum;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  background: string;
  timeLimit: number;
  obstacleFrequency: number;
  coinFrequency: number;
  powerUpFrequency: number;
  baseSpeed: number;
  trafficDensity: number;
}

export const LEVELS: Record<LevelEnum, LevelConfig> = {
  [LevelEnum.city_streets]: {
    id: LevelEnum.city_streets,
    name: 'City Streets',
    description: 'Basic straight roads, few obstacles, low traffic',
    difficulty: 'Easy',
    background: ASSETS.backgrounds.cityDay,
    timeLimit: 60,
    obstacleFrequency: 0.3,
    coinFrequency: 0.5,
    powerUpFrequency: 0.1,
    baseSpeed: 5,
    trafficDensity: 0.2
  },
  [LevelEnum.downtown_rush]: {
    id: LevelEnum.downtown_rush,
    name: 'Downtown Rush',
    description: 'More traffic, tighter turns',
    difficulty: 'Medium',
    background: ASSETS.backgrounds.cityDay,
    timeLimit: 75,
    obstacleFrequency: 0.5,
    coinFrequency: 0.6,
    powerUpFrequency: 0.15,
    baseSpeed: 6,
    trafficDensity: 0.4
  },
  [LevelEnum.neon_night]: {
    id: LevelEnum.neon_night,
    name: 'Neon Night',
    description: 'Night mode, limited visibility, more obstacles',
    difficulty: 'Medium',
    background: ASSETS.backgrounds.neonNight,
    timeLimit: 80,
    obstacleFrequency: 0.6,
    coinFrequency: 0.5,
    powerUpFrequency: 0.2,
    baseSpeed: 6.5,
    trafficDensity: 0.5
  },
  [LevelEnum.highway_drift]: {
    id: LevelEnum.highway_drift,
    name: 'Highway Drift',
    description: 'Fast-moving highway, ramps & nitro zones',
    difficulty: 'Hard',
    background: ASSETS.backgrounds.highway,
    timeLimit: 90,
    obstacleFrequency: 0.7,
    coinFrequency: 0.7,
    powerUpFrequency: 0.25,
    baseSpeed: 8,
    trafficDensity: 0.6
  },
  [LevelEnum.underground_tunnel]: {
    id: LevelEnum.underground_tunnel,
    name: 'Underground Tunnel',
    description: 'Maze-like tunnels, time-limited',
    difficulty: 'Hard',
    background: ASSETS.backgrounds.tunnel,
    timeLimit: 70,
    obstacleFrequency: 0.8,
    coinFrequency: 0.6,
    powerUpFrequency: 0.2,
    baseSpeed: 7,
    trafficDensity: 0.7
  },
  [LevelEnum.bonus_challenge]: {
    id: LevelEnum.bonus_challenge,
    name: 'Bonus Challenge',
    description: 'Collect max coins under time pressure',
    difficulty: 'Expert',
    background: ASSETS.backgrounds.neonNight,
    timeLimit: 60,
    obstacleFrequency: 0.9,
    coinFrequency: 1.0,
    powerUpFrequency: 0.3,
    baseSpeed: 9,
    trafficDensity: 0.8
  }
};

export const LEVEL_ORDER = [
  LevelEnum.city_streets,
  LevelEnum.downtown_rush,
  LevelEnum.neon_night,
  LevelEnum.highway_drift,
  LevelEnum.underground_tunnel,
  LevelEnum.bonus_challenge
];

export function getNextLevel(currentLevel: LevelEnum): LevelEnum | null {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel);
  if (currentIndex === -1 || currentIndex === LEVEL_ORDER.length - 1) {
    return null;
  }
  return LEVEL_ORDER[currentIndex + 1];
}
