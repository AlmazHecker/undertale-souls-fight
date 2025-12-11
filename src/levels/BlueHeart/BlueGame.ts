import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { ShoeManager } from "./helpers/ShoeManager.ts";
import { StarManager } from "./helpers/StarManager.ts";

import { Heart } from "@/utils/items/Heart.ts";
import { BaseGame } from "@/core/BaseGame.ts";
import { Health } from "@/ui/Health/Health.ts";
import { getGlobalTicker } from "@/utils/helpers/pixi.helper.ts";
import { GLOBAL_SCALE } from "@/config/engine.ts";
import { Star } from "./assets/sprite/Star.ts";

export class BlueGame extends BaseGame {
  private shoeManager: ShoeManager;
  private starManager: StarManager;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void
  ) {
    super(app, heart, health, onFinish);
    this.shoeManager = new ShoeManager(app, heart, 10000);
    this.starManager = new StarManager(app, heart);
    this.heart.maxHeightFromBottom = Star.height * (1.2 * GLOBAL_SCALE);
  }

  async preparingHelp() {
    return this.shoeManager.preparingHelp();
  }

  async initialize() {
    await this.shoeManager.initialize();
    await this.starManager.initialize();

    getGlobalTicker().add(this.startGameLoop, this);

    return this;
  }

  startGameLoop() {
    const collisions = this.checkCollisions();
    if (this.status === "HELPING" || this.starManager.isHelping) {
      this.handleHeal(collisions);
    } else {
      this.handleDamage(collisions);
    }
  }

  handleHeal(collisions: Sprite[]) {
    collisions.forEach((star) => {
      this.starManager.starContainer.removeChild(star);
      this.health.incrementHealth();
    });
  }

  async helpUser() {
    await Promise.all([
      this.starManager.helpUser(),
      this.shoeManager.helpUser(),
    ]);

    setTimeout(() => {
      this.emit("status", "FINISH");

      return this.onFinish();
    }, 4000);
  }

  checkCollisions() {
    this.isBtnAndHeartColliding =
      this.shoeManager.actButton?.isCollidingWithHeart(this.heart) as boolean;

    const collisions: Sprite[] = [];
    collisions.push(...this.shoeManager.infiniteShoesLogic());
    collisions.push(...this.starManager.infiniteStarsLogic());

    if (this.isBtnAndHeartColliding) return [];
    return collisions;
  }

  destroy(): Promise<void> | void {
    this.shoeManager.destroy();
    this.starManager.destroy();
    getGlobalTicker().remove(this.startGameLoop, this);
  }
}
