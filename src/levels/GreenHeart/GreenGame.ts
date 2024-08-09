import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { PanManager } from "@/levels/GreenHeart/helpers/PanManager.ts";
import { Health } from "@/ui/Health/Health.ts";
import { BaseGame } from "@/utils/helpers/BaseGame.ts";
import { Heart } from "@/utils/items/Heart.ts";

export class GreenGame extends BaseGame {
  private panManager: PanManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void,
  ) {
    super(app, heart, health, onFinish);
    this.panManager = new PanManager(app, heart);
  }

  async initialize() {
    await this.panManager.initialize();
    this.startGameLoop();

    this.emit("status", "STARTED");
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
    await this.panManager.helpUser();

    setTimeout(() => {
      this.emit("status", "FINISH");
      return this.onFinish();
    }, 4000);
  }

  checkCollisions() {
    this.isBtnAndHeartColliding =
      this.panManager.actButton?.isCollidingWithHeart(this.heart) as boolean;

    return this.panManager.checkCollisions();
  }

  destroy(): Promise<void> | void {
    this.destroy();
    this.ticker.stop();
    this.ticker.destroy();
  }
}
