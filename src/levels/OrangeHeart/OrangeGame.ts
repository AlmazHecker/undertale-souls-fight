import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Heart } from "@/utils/items/Heart.ts";
import { Health } from "@/ui/Health/Health.ts";
import { BaseGame } from "@/utils/helpers/BaseGame.ts";
import { GloveManager } from "./helpers/GloveManager.ts";

export class OrangeGame extends BaseGame {
  private gloveManager: GloveManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void,
  ) {
    super(app, heart, health, onFinish);
    this.gloveManager = new GloveManager(app, heart);
  }

  async initialize() {
    await this.gloveManager.initialize();
    this.app.stage.addChild(this.heart.container);
    this.startGameLoop();

    this.emit("status", "STARTED");
    this.ticker.start();
    return this;
  }

  startGameLoop() {
    this.ticker.add(() => {
      const collisions = this.gloveManager.checkCollisions();

      if (this.gloveManager.actButton) {
        this.isBtnAndHeartColliding =
          this.gloveManager.actButton.isCollidingWithHeart(this.heart);
      }

      if (this.status === "HELPING") {
        this.handleHeal(collisions);
      } else {
        this.handleDamage(collisions);
      }
    });
  }

  handleHeal(collisions: Sprite[]) {
    collisions.forEach((collision) => {
      this.health.incrementHealth();

      // little optimization
      this.gloveManager.gloveContainers[+collision.label]?.removeChild(
        collision,
      );
    });
  }

  async helpUser() {
    this.gloveManager.actButton.disappear();
    await this.gloveManager.helpUser();

    setTimeout(() => {
      this.emit("status", "FINISH");
      return this.onFinish();
    }, 4000);
  }

  destroy(): Promise<void> | void {
    this.gloveManager.destroy();
    this.ticker.stop();
    this.ticker.destroy();
  }
}
