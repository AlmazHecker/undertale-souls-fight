import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import { NoteManager } from "@/levels/PurpleHeart/helpers/NoteManager.ts";
import { TextManager } from "@/levels/PurpleHeart/helpers/TextManager.ts";
import { Health } from "@/ui/Health/Health.ts";
import { BaseGame } from "@/core/BaseGame.ts";
import { getGlobalTicker } from "@/utils/helpers/pixi.helper";
import { WIDTH } from "@/config/engine";

export class PurpleGame extends BaseGame {
  private noteManager: NoteManager;
  private textManager: TextManager;

  public isBtnAndHeartColliding: boolean = true;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void
  ) {
    super(app, heart, health, onFinish);
    heart.maxHeightFromBottom = 0;

    // making smaller area
    const activeWidth = Math.max(600, WIDTH * 0.65);
    const sideMargin = (WIDTH - activeWidth) / 2;

    this.textManager = new TextManager(
      app,
      heart,
      sideMargin,
      activeWidth,
      10000
    );
    this.noteManager = new NoteManager(app, heart, sideMargin, activeWidth);

    this.app.stage.addChild(this.heart.container);
  }

  async initialize() {
    await this.noteManager.initialize();
    await this.textManager.initialize();

    getGlobalTicker().add(this.startGameLoop, this);
    return this;
  }

  startGameLoop() {
    this.handleDamage(this.noteManager.infiniteNotesAnimation()); // works even after saving
    const collisions = this.textManager.infiniteTextAnimation();

    this.isBtnAndHeartColliding =
      this.textManager.actButton.isCollidingWithHeart(this.heart);
    if (this.status === "HELPING") {
      this.handleHeal(collisions);
    } else {
      this.handleDamage(collisions);
    }
  }

  handleHeal(collisions: Container[]) {
    collisions.forEach((collision) => {
      this.health.setHealthPoints(2);
      this.textManager.removeText(collision);
    });
  }

  preparingHelp() {
    return this.textManager.preparingHelp();
  }

  async helpUser() {
    await this.noteManager.helpUser();
    await this.textManager.helpUser();

    setTimeout(() => {
      this.emit("status", "FINISH");
      return this.onFinish();
    }, 4000);
  }

  destroy(): Promise<void> | void {
    this.noteManager.destroy();
    this.textManager.destroy();
    getGlobalTicker().remove(this.startGameLoop, this);
  }
}
