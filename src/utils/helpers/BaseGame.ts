import { Application, Container, Ticker } from "pixi.js";
import EventEmitter from "eventemitter3";
import { Heart } from "../items/Heart.ts";
import { createTicker } from "./pixi.helper.ts";
import { Health } from "@/ui/Health/Health.ts";

interface GameEvents {
  status: (status: GameLifeCycle) => void;
}

export type GameLifeCycle =
  | "IDLE"
  | "HELP_REQUESTED"
  | "HELPING"
  | "FINISH"
  | "GAME_OVER";

export abstract class BaseGame extends EventEmitter<GameEvents> {
  public status: GameLifeCycle = "IDLE";
  public isBtnAndHeartColliding = false;

  protected ticker: Ticker;
  private collisionCooldown = false;

  protected constructor(
    protected readonly app: Application,
    public readonly heart: Heart,
    public readonly health: Health,
    protected readonly onFinish: () => void,
  ) {
    super();
    this.ticker = createTicker();
    this.app.renderer.clear({ clear: true });
    this.on("status", this.statusListener, this);
  }

  abstract initialize(): Promise<unknown>;

  abstract startGameLoop(): void;

  abstract handleHeal(collisions: Container[]): void;

  abstract helpUser(): Promise<void>;

  abstract destroy(): Promise<void> | void;

  private statusListener(status: GameLifeCycle) {
    if (status === this.status) return;

    if (status === "HELP_REQUESTED") {
      // setTimeout(
      //   () => {
      this.helpUser().then(() => this.emit("status", "HELPING"));
      // },
      //   Math.random() * 2000 + 1000,
      // );
    }

    this.status = status;
  }

  private startCollisionCooldown() {
    this.collisionCooldown = true;
    setTimeout(() => {
      this.collisionCooldown = false;
    }, 1000);
  }

  public handleDamage(collisions: Container[]) {
    if (collisions.length !== 0 && !this.collisionCooldown) {
      this.health.setHealthPoints(-3);
      this.heart.startBlinking();
      this.startCollisionCooldown();
    }
  }
}
