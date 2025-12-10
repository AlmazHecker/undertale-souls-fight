import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Heart } from "@/utils/items/Heart.ts";
import { Health } from "@/ui/Health/Health.ts";
import { BaseGame } from "@/core/BaseGame.ts";
import { GloveManager } from "./helpers/GloveManager.ts";
import { getGlobalTicker } from "@/utils/helpers/pixi.helper.ts";

export class OrangeGame extends BaseGame {
  private gloveManager: GloveManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void
  ) {
    super(app, heart, health, onFinish);
    this.gloveManager = new GloveManager(app, heart, 10000);
  }

  async initialize() {
    await this.gloveManager.initialize();
    this.app.stage.addChild(this.heart.container);

    getGlobalTicker().add(this.startGameLoop, this);
    return this;
  }

  startGameLoop() {
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
  }

  handleHeal(collisions: Sprite[]) {
    collisions.forEach((collision) => {
      this.health.incrementHealth();
      collision.visible = false;
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
    getGlobalTicker().remove(this.startGameLoop, this);
  }

  preparingHelp() {}
}
