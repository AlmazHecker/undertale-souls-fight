import * as PIXI from "pixi.js";
import { Graphics, Ticker } from "pixi.js";

import { BaseItem } from "@/core/BaseItem.ts";
import { KeyboardHandler } from "../helpers/mover.helper.ts";
import { createTicker } from "../helpers/pixi.helper.ts";

const svgPath = [
  24, 8, 24, 6, 22, 6, 22, 4, 20, 4, 20, 6, 18, 6, 18, 8, 16, 8, 16, 10, 14, 10,
  14, 8, 12, 8, 12, 6, 10, 6, 10, 4, 8, 4, 8, 6, 6, 6, 6, 8, 4, 8, 4, 18, 6, 18,
  6, 20, 8, 20, 8, 22, 10, 22, 10, 24, 12, 24, 12, 26, 18, 26, 18, 24, 20, 24,
  20, 22, 22, 22, 22, 20, 24, 20, 24, 18, 26, 18, 26, 8,
];

export class Heart extends BaseItem<Graphics & { vx: number; vy: number }> {
  public maxHeightFromBottom: number = 0;
  public keyboardHandler: KeyboardHandler;

  private app: PIXI.Application;
  private ticker: Ticker = createTicker();
  private blinkInterval: ReturnType<typeof setInterval> | undefined; // Blink interval

  constructor(app: PIXI.Application, maxHeightFromBottom: number = 0) {
    const graphics = new Graphics() as Graphics & { vx: number; vy: number };
    const x = app.renderer.width / 2;
    const y = app.renderer.height / 2;
    graphics.fill("red");
    super(graphics, x, y);

    const heartPolygon = this.toPolygon(svgPath);
    this.container.poly(heartPolygon.points);
    this.app = app;

    this.container.fill("red");
    this.container.height = 25;
    this.container.width = 25;
    this.container._zIndex = 10;

    this.centerWithPivot();

    this.container.hitArea = heartPolygon;
    this.maxHeightFromBottom = maxHeightFromBottom;

    this.keyboardHandler = new KeyboardHandler();
    this.keyboardHandler.setup();
  }

  public updatePosition(delta: number) {
    this.container.x += this.container.vx * delta;
    this.container.y += this.container.vy * delta;
    if (this.container.x < this.container.width / 2) {
      this.container.x = this.container.width / 2;
    }
    if (this.container.x > this.app.renderer.width - this.container.width / 2) {
      this.container.x = this.app.renderer.width - this.container.width / 2;
    }
    if (this.container.y < this.container.height / 2) {
      this.container.y = this.container.height / 2;
    }

    if (
      this.maxHeightFromBottom !== 0 &&
      this.container.y < this.app.renderer.height - this.maxHeightFromBottom
    ) {
      // Constrain to max height from bottom
      this.container.y = this.app.renderer.height - this.maxHeightFromBottom;
    }
    if (
      this.container.y >
      this.app.renderer.height - this.container.height / 2
    ) {
      this.container.y = this.app.renderer.height - this.container.height / 2;
    }
  }

  public setVelocity(vx: number, vy: number) {
    this.container.vx = vx;
    this.container.vy = vy;
  }

  public startBlinking() {
    let isRed = true;
    this.blinkInterval = setInterval(() => {
      this.container.clear().poly(this.toPolygon(svgPath).points || []);
      this.container.fill(isRed ? "red" : "transparent");
      isRed = !isRed;
    }, 100);

    setTimeout(() => {
      clearInterval(this.blinkInterval);
      this.container.clear().poly(this.toPolygon(svgPath).points || []);
      this.container.fill("red");
    }, 1000);
  }

  setup() {
    this.ticker.add((delta) => {
      handleMovement(delta);
    });

    this.ticker.start();
    const handleMovement = (ticker: PIXI.Ticker) => {
      let vx = 0;
      let vy = 0;
      const keyState = this.keyboardHandler.keyState;

      if (keyState.ArrowLeft) vx -= 3;
      if (keyState.ArrowRight) vx += 3;
      if (keyState.ArrowUp) vy -= 3;
      if (keyState.ArrowDown) vy += 3;

      this.setVelocity(vx, vy);
      this.updatePosition(ticker.deltaTime);
    };
  }

  destroy() {
    this.keyboardHandler.cleanup();
    this.ticker.stop();
    this.ticker.destroy();
  }
}
