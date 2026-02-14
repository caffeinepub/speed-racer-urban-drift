import type { LevelConfig } from './levels';
import type { CarConfig } from './cars';
import { InputManager } from './input';
import { PowerUpType, type PowerUp, type ActivePowerUp, POWER_UP_DURATIONS } from './powerups';

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
}

export interface Coin extends GameObject {
  collected: boolean;
}

export interface Obstacle extends GameObject {
  type: 'cone' | 'barrier' | 'pothole';
}

export type GameState = 'running' | 'paused' | 'complete' | 'gameover';

export interface GameEngineState {
  state: GameState;
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    health: number;
  };
  coins: Coin[];
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
  score: number;
  coinsCollected: number;
  timeRemaining: number;
  scrollOffset: number;
  nitroCharge: number;
  nitroActive: boolean;
  nitroCooldown: number;
}

export class GameEngine {
  private state: GameEngineState;
  private level: LevelConfig;
  private car: CarConfig;
  private input: InputManager;
  private lastTime: number = 0;
  private spawnTimer: number = 0;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(level: LevelConfig, car: CarConfig, canvasWidth: number, canvasHeight: number) {
    this.level = level;
    this.car = car;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.input = new InputManager();

    this.state = {
      state: 'running',
      player: {
        x: canvasWidth / 2 - 30,
        y: canvasHeight - 150,
        width: 60,
        height: 80,
        speed: level.baseSpeed * car.stats.topSpeed,
        health: 100
      },
      coins: [],
      obstacles: [],
      powerUps: [],
      activePowerUps: [],
      score: 0,
      coinsCollected: 0,
      timeRemaining: level.timeLimit,
      scrollOffset: 0,
      nitroCharge: 100,
      nitroActive: false,
      nitroCooldown: 0
    };
  }

  start() {
    this.input.enable();
    this.lastTime = performance.now();
  }

  pause() {
    this.state.state = 'paused';
  }

  resume() {
    this.state.state = 'running';
    this.lastTime = performance.now();
  }

  restart() {
    this.state = {
      state: 'running',
      player: {
        x: this.canvasWidth / 2 - 30,
        y: this.canvasHeight - 150,
        width: 60,
        height: 80,
        speed: this.level.baseSpeed * this.car.stats.topSpeed,
        health: 100
      },
      coins: [],
      obstacles: [],
      powerUps: [],
      activePowerUps: [],
      score: 0,
      coinsCollected: 0,
      timeRemaining: this.level.timeLimit,
      scrollOffset: 0,
      nitroCharge: 100,
      nitroActive: false,
      nitroCooldown: 0
    };
    this.lastTime = performance.now();
  }

  destroy() {
    this.input.disable();
  }

  update(currentTime: number): GameEngineState {
    if (this.state.state !== 'running') {
      return this.state;
    }

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updateTimer(deltaTime);
    this.updatePlayer(deltaTime);
    this.updateScrolling(deltaTime);
    this.spawnObjects(deltaTime);
    this.updateObjects(deltaTime);
    this.checkCollisions();
    this.updatePowerUps(currentTime);
    this.updateNitro(deltaTime);
    this.checkGameOver();

    return this.state;
  }

  private updateTimer(deltaTime: number) {
    this.state.timeRemaining -= deltaTime;
    if (this.state.timeRemaining <= 0) {
      this.state.timeRemaining = 0;
      this.state.state = 'complete';
    }
  }

  private updatePlayer(deltaTime: number) {
    const inputState = this.input.getState();
    const moveSpeed = 400 * this.car.stats.handling;

    if (inputState.left) {
      this.state.player.x -= moveSpeed * deltaTime;
    }
    if (inputState.right) {
      this.state.player.x += moveSpeed * deltaTime;
    }

    if (inputState.boost && this.state.nitroCharge >= 20 && this.state.nitroCooldown <= 0) {
      this.activateNitro();
    }

    this.state.player.x = Math.max(50, Math.min(this.canvasWidth - 50 - this.state.player.width, this.state.player.x));
  }

  private activateNitro() {
    this.state.nitroActive = true;
    this.state.nitroCharge -= 20;
    this.state.nitroCooldown = 2;
  }

  private updateNitro(deltaTime: number) {
    if (this.state.nitroActive) {
      this.state.player.speed = this.level.baseSpeed * this.car.stats.topSpeed * 1.5;
      this.state.nitroActive = false;
    } else {
      this.state.player.speed = this.level.baseSpeed * this.car.stats.topSpeed;
    }

    if (this.state.nitroCooldown > 0) {
      this.state.nitroCooldown -= deltaTime;
    }

    if (this.state.nitroCharge < 100) {
      this.state.nitroCharge = Math.min(100, this.state.nitroCharge + 10 * deltaTime);
    }
  }

  private updateScrolling(deltaTime: number) {
    this.state.scrollOffset += this.state.player.speed * 100 * deltaTime;
  }

  private spawnObjects(deltaTime: number) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer > 0.5) {
      this.spawnTimer = 0;

      if (Math.random() < this.level.coinFrequency) {
        this.spawnCoin();
      }

      if (Math.random() < this.level.obstacleFrequency) {
        this.spawnObstacle();
      }

      if (Math.random() < this.level.powerUpFrequency) {
        this.spawnPowerUp();
      }
    }
  }

  private spawnCoin() {
    const lanes = 5;
    const laneWidth = (this.canvasWidth - 100) / lanes;
    const lane = Math.floor(Math.random() * lanes);
    
    this.state.coins.push({
      x: 50 + lane * laneWidth + laneWidth / 2 - 15,
      y: -30,
      width: 30,
      height: 30,
      collected: false
    });
  }

  private spawnObstacle() {
    const lanes = 5;
    const laneWidth = (this.canvasWidth - 100) / lanes;
    const lane = Math.floor(Math.random() * lanes);
    const types: Obstacle['type'][] = ['cone', 'barrier', 'pothole'];
    
    this.state.obstacles.push({
      x: 50 + lane * laneWidth + laneWidth / 2 - 25,
      y: -50,
      width: 50,
      height: 50,
      type: types[Math.floor(Math.random() * types.length)]
    });
  }

  private spawnPowerUp() {
    const lanes = 5;
    const laneWidth = (this.canvasWidth - 100) / lanes;
    const lane = Math.floor(Math.random() * lanes);
    const types = [PowerUpType.NITRO, PowerUpType.SHIELD, PowerUpType.MAGNET];
    
    this.state.powerUps.push({
      type: types[Math.floor(Math.random() * types.length)],
      x: 50 + lane * laneWidth + laneWidth / 2 - 20,
      y: -40,
      width: 40,
      height: 40,
      active: false
    });
  }

  private updateObjects(deltaTime: number) {
    const scrollSpeed = this.state.player.speed * 100;

    this.state.coins = this.state.coins.filter(coin => {
      if (!coin.collected) {
        coin.y += scrollSpeed * deltaTime;
      }
      return coin.y < this.canvasHeight + 50 && !coin.collected;
    });

    this.state.obstacles = this.state.obstacles.filter(obstacle => {
      obstacle.y += scrollSpeed * deltaTime;
      return obstacle.y < this.canvasHeight + 50;
    });

    this.state.powerUps = this.state.powerUps.filter(powerUp => {
      if (!powerUp.active) {
        powerUp.y += scrollSpeed * deltaTime;
      }
      return powerUp.y < this.canvasHeight + 50 && !powerUp.active;
    });
  }

  private checkCollisions() {
    const hasMagnet = this.state.activePowerUps.some(p => p.type === PowerUpType.MAGNET);
    const magnetRadius = hasMagnet ? 150 : 0;

    this.state.coins.forEach(coin => {
      if (coin.collected) return;

      const distance = Math.sqrt(
        Math.pow(coin.x + coin.width / 2 - (this.state.player.x + this.state.player.width / 2), 2) +
        Math.pow(coin.y + coin.height / 2 - (this.state.player.y + this.state.player.height / 2), 2)
      );

      if (distance < magnetRadius || this.checkRectCollision(this.state.player, coin)) {
        coin.collected = true;
        this.state.coinsCollected++;
        this.state.score += 10;
      }
    });

    const hasShield = this.state.activePowerUps.some(p => p.type === PowerUpType.SHIELD);

    this.state.obstacles.forEach((obstacle, index) => {
      if (this.checkRectCollision(this.state.player, obstacle)) {
        if (hasShield) {
          this.state.activePowerUps = this.state.activePowerUps.filter(p => p.type !== PowerUpType.SHIELD);
          this.state.obstacles.splice(index, 1);
        } else {
          this.state.player.health -= 25;
          this.state.obstacles.splice(index, 1);
        }
      }
    });

    this.state.powerUps.forEach(powerUp => {
      if (powerUp.active) return;

      if (this.checkRectCollision(this.state.player, powerUp)) {
        powerUp.active = true;
        this.activatePowerUp(powerUp.type);
      }
    });
  }

  private activatePowerUp(type: PowerUpType) {
    if (type === PowerUpType.NITRO) {
      this.state.nitroCharge = Math.min(100, this.state.nitroCharge + 50);
    } else {
      this.state.activePowerUps.push({
        type,
        duration: POWER_UP_DURATIONS[type],
        startTime: performance.now()
      });
    }
  }

  private updatePowerUps(currentTime: number) {
    this.state.activePowerUps = this.state.activePowerUps.filter(powerUp => {
      const elapsed = currentTime - powerUp.startTime;
      return elapsed < powerUp.duration;
    });
  }

  private checkRectCollision(a: GameObject, b: GameObject): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private checkGameOver() {
    if (this.state.player.health <= 0) {
      this.state.state = 'gameover';
    }
  }

  getState(): GameEngineState {
    return this.state;
  }

  getInput(): InputManager {
    return this.input;
  }
}
