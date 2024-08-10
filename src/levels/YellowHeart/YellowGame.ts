import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import { Health } from "@/ui/Health/Health.ts";
import { PistolManager } from "@/levels/YellowHeart/helpers/PistolManager.ts";
import { BaseGame } from "@/utils/helpers/BaseGame.ts";

export class YellowGame extends BaseGame {
  private pistolManager: PistolManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void,
  ) {
    super(app, heart, health, onFinish);
    this.pistolManager = new PistolManager(app, heart);
  }

  async initialize() {
    await this.pistolManager.initialize();

    this.startGameLoop();

    this.ticker.start();
    return this;
  }

  startGameLoop() {
    this.ticker.add(() => {
      const collisions = this.checkCollisions();
      if (this.status === "HELPING") {
        this.handleHeal(collisions);
      } else {
        this.handleDamage(collisions);
      }
    });
  }

  handleHeal(collisions: Sprite[]) {
    collisions.forEach((sprite) => {
      this.app.stage.removeChild(sprite);
      this.health.incrementHealth();
    });
  }

  async helpUser() {
    await this.pistolManager.helpUser();

    setTimeout(() => {
      this.emit("status", "FINISH");
      return this.onFinish();
    }, 6000);
  }

  checkCollisions() {
    this.isBtnAndHeartColliding =
      this.pistolManager.actButton?.isCollidingWithHeart(this.heart) as boolean;
    return this.pistolManager.checkCollisions();
  }

  destroy(): Promise<void> | void {
    this.pistolManager.destroy();
    this.ticker.stop();
    this.ticker.destroy();
  }
}
