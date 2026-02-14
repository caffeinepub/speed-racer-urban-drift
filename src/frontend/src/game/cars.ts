import { CarType as CarTypeEnum } from '../backend';
import { ASSETS } from './assets';

export interface CarConfig {
  id: CarTypeEnum;
  name: string;
  category: string;
  sprite: string;
  cost: number;
  stats: {
    topSpeed: number;
    acceleration: number;
    handling: number;
  };
}

export const CARS: Record<CarTypeEnum, CarConfig> = {
  [CarTypeEnum.basic]: {
    id: CarTypeEnum.basic,
    name: 'Starter',
    category: 'Basic',
    sprite: ASSETS.cars.sports,
    cost: 0,
    stats: {
      topSpeed: 1.0,
      acceleration: 1.0,
      handling: 1.0
    }
  },
  [CarTypeEnum.sports]: {
    id: CarTypeEnum.sports,
    name: 'Velocity',
    category: 'Sports',
    sprite: ASSETS.cars.sports,
    cost: 500,
    stats: {
      topSpeed: 1.2,
      acceleration: 1.1,
      handling: 1.0
    }
  },
  [CarTypeEnum.muscle]: {
    id: CarTypeEnum.muscle,
    name: 'Thunder',
    category: 'Muscle',
    sprite: ASSETS.cars.muscle,
    cost: 750,
    stats: {
      topSpeed: 1.3,
      acceleration: 1.3,
      handling: 0.9
    }
  },
  [CarTypeEnum.drift]: {
    id: CarTypeEnum.drift,
    name: 'Sidewinder',
    category: 'Drift',
    sprite: ASSETS.cars.drift,
    cost: 1000,
    stats: {
      topSpeed: 1.1,
      acceleration: 1.0,
      handling: 1.4
    }
  },
  [CarTypeEnum.supercar]: {
    id: CarTypeEnum.supercar,
    name: 'Apex',
    category: 'Supercar',
    sprite: ASSETS.cars.super,
    cost: 1500,
    stats: {
      topSpeed: 1.5,
      acceleration: 1.4,
      handling: 1.2
    }
  }
};
