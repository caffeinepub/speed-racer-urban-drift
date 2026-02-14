export enum PowerUpType {
  NITRO = 'nitro',
  SHIELD = 'shield',
  MAGNET = 'magnet'
}

export interface PowerUp {
  type: PowerUpType;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

export interface ActivePowerUp {
  type: PowerUpType;
  duration: number;
  startTime: number;
}

export const POWER_UP_DURATIONS = {
  [PowerUpType.SHIELD]: 5000,
  [PowerUpType.MAGNET]: 7000,
  [PowerUpType.NITRO]: 0
};

export const POWER_UP_DESCRIPTIONS = {
  [PowerUpType.NITRO]: 'Nitro Boost! Speed increased!',
  [PowerUpType.SHIELD]: 'Shield Active! Protected from collisions!',
  [PowerUpType.MAGNET]: 'Coin Magnet! Auto-collect nearby coins!'
};
