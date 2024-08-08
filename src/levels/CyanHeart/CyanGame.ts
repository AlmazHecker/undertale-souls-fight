import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";

import { Heart } from "../../utils/items/Heart.ts";
import { KnifeManager } from "./helpers/KnifeManager.ts";
import { BaseGame } from "../../utils/helpers/BaseGame.ts";
import { createTicker } from "../../utils/helpers/pixi.helper.ts";
import { Health } from "../../ui/Health/Health.ts";

export class CyanGame extends BaseGame {
  private knifeManager: KnifeManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void,
  ) {
    super(app, heart, health, onFinish);
    this.knifeManager = new KnifeManager(app, heart);
  }

  async initialize() {
    await this.knifeManager.initialize();
    this.app.stage.addChild(this.heart.container);
    this.startGameLoop();

    this.emit("status", "STARTED");
    this.on("status", this.statusListener);
    this.ticker.start();
    return this;
  }

  startGameLoop() {
    this.ticker = createTicker();
    this.ticker.add(() => {
      const collisions = this.knifeManager.infiniteKnivesAnimation();
      this.isBtnAndHeartColliding =
        this.knifeManager.actButton.isCollidingWithHeart(this.heart);

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
      this.knifeManager.knifeContainer.removeChild(collision);
    });
  }

  async helpUser() {
    this.knifeManager.actButton.disappear();
    await this.knifeManager.helpUser();

    setTimeout(() => {
      this.emit("status", "FINISH");
      return this.onFinish();
    }, 4000);
  }

  destroy() {
    this.knifeManager.destroy();
    this.ticker.stop();
    this.ticker.destroy();
  }
}
