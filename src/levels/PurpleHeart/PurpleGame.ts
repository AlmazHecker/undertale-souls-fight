import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import { NoteManager } from "@/levels/PurpleHeart/helpers/NoteManager.ts";
import { TextManager } from "@/levels/PurpleHeart/helpers/TextManager.ts";
import { Health } from "@/ui/Health/Health.ts";
import { BaseGame } from "@/core/BaseGame.ts";

export class PurpleGame extends BaseGame {
  private noteManager: NoteManager;
  private textManager: TextManager;

  public isBtnAndHeartColliding: boolean = true;

  constructor(
    app: PIXI.Application,
    heart: Heart,
    health: Health,
    onFinish: () => void,
  ) {
    super(app, heart, health, onFinish);
    heart.maxHeightFromBottom = 0;
    heart.container.x = app.renderer.width / 2;
    heart.container.y = app.renderer.height / 2;
    this.textManager = new TextManager(app, heart, 10000);
    this.noteManager = new NoteManager(app, heart);

    this.app.stage.addChild(this.heart.container);
  }

  async initialize() {
    await this.noteManager.initialize();
    await this.textManager.initialize();
    this.startGameLoop();

    this.ticker.start();
    return this;
  }

  startGameLoop() {
    this.ticker.add(() => {
      this.handleDamage(this.noteManager.infiniteNotesAnimation()); // works even after saving
      const collisions = this.textManager.infiniteTextAnimation();

      this.isBtnAndHeartColliding =
        this.textManager.actButton.isCollidingWithHeart(this.heart);
      if (this.status === "HELPING") {
        this.handleHeal(collisions);
      } else {
        this.handleDamage(collisions);
      }
    });
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
    this.ticker.stop();
    this.ticker.destroy();
  }
}
