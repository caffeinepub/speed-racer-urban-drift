import type { GameEngineState } from './engine';
import type { LevelConfig } from './levels';
import type { CarConfig } from './cars';
import { ASSETS } from './assets';
import { PowerUpType } from './powerups';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private images: Map<string, HTMLImageElement>;
  private level: LevelConfig;
  private car: CarConfig;
  private backgroundOffset: number = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    images: Map<string, HTMLImageElement>,
    level: LevelConfig,
    car: CarConfig
  ) {
    this.ctx = ctx;
    this.images = images;
    this.level = level;
    this.car = car;
  }

  render(state: GameEngineState) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    this.renderBackground(state.scrollOffset);
    this.renderRoadLines(state.scrollOffset);
    this.renderCoins(state.coins);
    this.renderObstacles(state.obstacles);
    this.renderPowerUps(state.powerUps);
    this.renderPlayer(state.player);
    
    if (state.nitroActive) {
      this.renderSpeedEffect();
    }
  }

  private renderBackground(scrollOffset: number) {
    const bg = this.images.get(this.level.background);
    if (!bg) return;

    const height = this.ctx.canvas.height;
    const width = this.ctx.canvas.width;
    
    this.backgroundOffset = (scrollOffset * 0.3) % height;
    
    this.ctx.drawImage(bg, 0, this.backgroundOffset - height, width, height);
    this.ctx.drawImage(bg, 0, this.backgroundOffset, width, height);
  }

  private renderRoadLines(scrollOffset: number) {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([20, 20]);

    const lanes = 4;
    const laneWidth = (this.ctx.canvas.width - 100) / 5;
    const offset = (scrollOffset * 2) % 40;

    for (let i = 1; i <= lanes; i++) {
      const x = 50 + i * laneWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, -offset);
      this.ctx.lineTo(x, this.ctx.canvas.height);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  private renderCoins(coins: GameEngineState['coins']) {
    const coinImg = this.images.get(ASSETS.icons.coin);
    
    coins.forEach(coin => {
      if (coin.collected) return;
      
      if (coinImg) {
        this.ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
      } else {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }

  private renderObstacles(obstacles: GameEngineState['obstacles']) {
    obstacles.forEach(obstacle => {
      const assetKey = obstacle.type === 'cone' ? ASSETS.obstacles.cone :
                       obstacle.type === 'barrier' ? ASSETS.obstacles.barrier :
                       ASSETS.obstacles.pothole;
      const img = this.images.get(assetKey);
      
      if (img) {
        this.ctx.drawImage(img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } else {
        this.ctx.fillStyle = '#FF4444';
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    });
  }

  private renderPowerUps(powerUps: GameEngineState['powerUps']) {
    powerUps.forEach(powerUp => {
      if (powerUp.active) return;
      
      const assetKey = powerUp.type === PowerUpType.NITRO ? ASSETS.icons.nitro :
                       powerUp.type === PowerUpType.SHIELD ? ASSETS.icons.shield :
                       ASSETS.icons.magnet;
      const img = this.images.get(assetKey);
      
      if (img) {
        this.ctx.drawImage(img, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      } else {
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      }
    });
  }

  private renderPlayer(player: GameEngineState['player']) {
    const carImg = this.images.get(this.car.sprite);
    
    if (carImg) {
      this.ctx.drawImage(carImg, player.x, player.y, player.width, player.height);
    } else {
      this.ctx.fillStyle = '#00FF00';
      this.ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }

  private renderSpeedEffect() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.ctx.canvas.height);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}
