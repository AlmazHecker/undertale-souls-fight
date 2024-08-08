import { Application, Container } from "pixi.js";
import EventEmitter from "eventemitter3";
import { Heart } from "../items/Heart.ts";
import { createTicker } from "./pixi.helper.ts";
import { Health } from "../../ui/Health/Health.ts";

interface GameEvents {
  status: (status: GameLifeCycle) => void;
}

export type GameLifeCycle =
  | "IDLE"
  | "STARTED"
  | "HELP_REQUESTED"
  | "HELP_PENDING"
  | "HELPING"
  | "FINISH";

export abstract class BaseGame extends EventEmitter<GameEvents> {
  status: GameLifeCycle = "IDLE";

  protected ticker = createTicker();
  public isBtnAndHeartColliding = false;
  public collisionCooldown = false;

  protected constructor(
    protected readonly app: Application,
    public readonly heart: Heart,
    public health: Health,
    protected readonly onFinish: () => void,
  ) {
    super();
    this.app.renderer.clear({ clear: true });
  }

  abstract initialize(): Promise<unknown>;

  abstract startGameLoop(): void;

  handleDamage(collisions: Container[]) {
    if (collisions.length !== 0 && !this.collisionCooldown) {
      this.health.setHealthPoints(-3);
      this.heart.startBlinking();
      this.collisionCooldown = true;
      setTimeout(() => {
        this.collisionCooldown = false;
      }, 1000);
    }
  }

  abstract handleHeal(collisions: Container[]): void;

  abstract helpUser(): Promise<void>;

  statusListener(status: GameLifeCycle) {
    if (status === this.status) return;

    switch (status) {
      case "HELP_REQUESTED": {
        setTimeout(
          () => {
            this.emit("status", "HELP_PENDING");
            this.helpUser().then(() => this.emit("status", "HELPING"));
          },
          Math.random() * 2000 + 1000,
        );
      }
    }

    this.status = status;
  }

  abstract destroy(): Promise<void> | void;
}
