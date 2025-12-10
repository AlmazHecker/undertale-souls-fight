import * as PIXI from "pixi.js";
import { Graphics, Ticker } from "pixi.js";
import { BaseItem } from "@/core/BaseItem.ts";
import { KeyboardHandler } from "../helpers/mover.helper.ts";
import { createTicker } from "../helpers/pixi.helper.ts";
import { GLOBAL_SCALE, HEIGHT, WIDTH } from "@/config/engine.ts";

const svgPath = [
  24, 8, 24, 6, 22, 6, 22, 4, 20, 4, 20, 6, 18, 6, 18, 8, 16, 8, 16, 10, 14, 10,
  14, 8, 12, 8, 12, 6, 10, 6, 10, 4, 8, 4, 8, 6, 6, 6, 6, 8, 4, 8, 4, 18, 6, 18,
  6, 20, 8, 20, 8, 22, 10, 22, 10, 24, 12, 24, 12, 26, 18, 26, 18, 24, 20, 24,
  20, 22, 22, 22, 22, 20, 24, 20, 24, 18, 26, 18, 26, 8,
];

export class Heart extends BaseItem<Graphics> {
  public maxHeightFromBottom: number = 0;
  private ticker: Ticker = createTicker();
  private blinkInterval?: ReturnType<typeof setInterval>;
  public keyboardHandler: KeyboardHandler;

  private polygon: PIXI.Polygon;

  constructor(maxHeightFromBottom = 0) {
    const graphics = new Graphics();
    super(graphics, WIDTH / 2, HEIGHT / 2);

    this.maxHeightFromBottom = maxHeightFromBottom;

    this.keyboardHandler = new KeyboardHandler();
    this.keyboardHandler.setup();

    this.polygon = this.toPolygon(svgPath);

    this.initGraphics();
    this.centerWithPivot();
    this.container.hitArea = this.polygon;
  }

  private initGraphics() {
    this.container.poly(this.polygon.points);
    this.container.fill("red");
    this.container.scale.set(GLOBAL_SCALE);
    this.container._zIndex = 10;
  }

  private handleMovement(delta: number) {
    let dx = 0;
    let dy = 0;
    const keyState = this.keyboardHandler.keyState;
    const speed = 3 * GLOBAL_SCALE;

    if (keyState.ArrowLeft) dx -= speed;
    if (keyState.ArrowRight) dx += speed;
    if (keyState.ArrowUp) dy -= speed;
    if (keyState.ArrowDown) dy += speed;

    this.updatePosition(dx * delta, dy * delta);
  }

  public updatePosition(dx: number, dy: number) {
    const { container } = this;
    container.x = Math.max(
      container.width / 2,
      Math.min(container.x + dx, WIDTH - container.width / 2)
    );

    let minY = container.height / 2;
    if (this.maxHeightFromBottom > 0) {
      minY = Math.max(minY, HEIGHT - this.maxHeightFromBottom);
    }
    container.y = Math.max(
      minY,
      Math.min(container.y + dy, HEIGHT - container.height / 2)
    );
  }

  public startBlinking(duration = 1000, interval = 100) {
    let isRed = false;
    this.blinkInterval = setInterval(() => {
      this.redrawBlink(isRed);
      isRed = !isRed;
    }, interval);

    setTimeout(() => {
      clearInterval(this.blinkInterval);
      this.redrawBlink(true);
    }, duration);
  }

  private redrawBlink(isRed?: boolean) {
    this.container.clear();
    this.container.poly(this.polygon.points);
    this.container.fill(isRed ? "red" : "transparent");
  }

  public setup() {
    this.ticker.add((ticker) => this.handleMovement(ticker.deltaTime));
    this.ticker.start();
  }

  public destroy() {
    this.keyboardHandler.cleanup();
    this.ticker.stop();
    this.ticker.destroy();

    if (this.blinkInterval) clearInterval(this.blinkInterval);
  }
}
