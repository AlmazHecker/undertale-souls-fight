import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { PanManager } from "@/levels/GreenHeart/helpers/PanManager.ts";
import { Health } from "@/ui/Health/Health.ts";
import { BaseGame } from "@/core/BaseGame.ts";
import { Heart } from "@/utils/items/Heart.ts";
import { getGlobalTicker } from "@/utils/helpers/pixi.helper";

export class GreenGame extends BaseGame {
  private panManager: PanManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void
  ) {
    heart.maxHeightFromBottom = 300;
    super(app, heart, health, onFinish, -4);
    this.panManager = new PanManager(app, heart);
  }

  async initialize() {
    await this.panManager.initialize();
    getGlobalTicker().add(this.startGameLoop, this);

    return this;
  }

  startGameLoop() {
    const collisions = this.checkCollisions();
    if (this.status === "HELPING") {
      this.handleHeal(collisions);
    } else {
      this.handleDamage(collisions);
    }
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
    this.panManager.destroy();
    getGlobalTicker().remove(this.startGameLoop, this);
  }

  preparingHelp() {}
}
