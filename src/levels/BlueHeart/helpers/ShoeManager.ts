import { Heart } from "@/utils/items/Heart.ts";

import * as PIXI from "pixi.js";
import { Application, Assets, Sprite } from "pixi.js";

import { Shoe } from "../assets/sprite/Shoe.ts";
import { ActButton } from "@/utils/items/ActButton.ts";
import { arePolygonsColliding } from "@/utils/helpers/pixi.helper.ts";
import { animateWithTimer, lerp } from "@/utils/helpers/timing.helper.ts";
import { GLOBAL_SCALE as GS, HEIGHT, WIDTH } from "@/config/engine.ts";

const GLOBAL_SCALE = GS * 1.3;

export class ShoeManager {
  public readonly actButton = new ActButton();
  private shoeSpeed = 1.7 * GLOBAL_SCALE;
  private verticalMoveDisabled: boolean = false;
  private readonly verticalAmplitude = 30 * GLOBAL_SCALE;
  private readonly shoeSpacing = 35 * GLOBAL_SCALE;

  private readonly shoes: Sprite[] = [];
  private readonly defaultY: number;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly actButtonCountDown: number
  ) {
    this.defaultY = HEIGHT - Shoe.height * GLOBAL_SCALE;
  }

  async initialize() {
    await this.actButton.initialize();
    const bundleAssets = await Assets.loadBundle("blue");

    const numShoesX = Math.floor(WIDTH / (Shoe.width + this.shoeSpacing)) + 1;

    for (let i = 0; i < numShoesX; i++) {
      const x = WIDTH + i * (Shoe.width + this.shoeSpacing);
      const y = this.defaultY;
      const shoe = new Shoe(x, y, bundleAssets.shoe);

      shoe.centerWithPivot();
      shoe.container.scale.set(GLOBAL_SCALE);

      (shoe as any).container.offset = i * 100 + Math.random() * 500;

      this.app.stage.addChild(shoe.container);
      this.shoes.push(shoe.container);
    }

    await this.createActButton();
  }

  public replaceRandomShoeWithActButton(actButton: ActButton) {
    const randomIndex = Math.floor(Math.random() * this.shoes.length);
    const shoe = this.shoes[randomIndex];

    actButton.container.x = shoe.x + Shoe.width / 2;
    actButton.container.y = this.defaultY + Shoe.height / 2;

    actButton.container.visible = true;
    (actButton as any).container.offset = (shoe as any).offset;
    this.app.stage.removeChild(shoe);
    this.shoes[randomIndex] = actButton.container;
  }

  public infiniteShoesLogic() {
    const collisions: Sprite[] = [];
    const { shoes, shoeSpeed, shoeSpacing, actButton, heart } = this;
    const lastShoeX = shoes[shoes.length - 1].x;

    shoes.forEach((shoe, i) => {
      shoe.x -= shoeSpeed;
      if (shoe.x + Shoe.width < 0) {
        shoe.x = lastShoeX + Shoe.width + shoeSpacing;

        if (shoe.label === "act-button") {
          actButton.container.x = shoe.x + Shoe.width / 2;
        }

        shoes.push(shoes.splice(i, 1)[0]);
        i--;
        return;
      }

      if (shoe.label !== "act-button") {
        const isDamaged = arePolygonsColliding(shoe, heart.container);
        if (isDamaged) collisions.push(shoe);
      }

      this.startVerticalMovement(shoe, i);
    });

    return collisions;
  }

  private startVerticalMovement(shoe: PIXI.Sprite, i: number) {
    const shoeHeightScaled = Shoe.height * GLOBAL_SCALE;
    const baselineY = HEIGHT - shoeHeightScaled / 2 - this.verticalAmplitude;

    const speed = 0.0042;

    if (this.verticalMoveDisabled) return;

    const t = performance.now() * speed + (shoe as any).offset;
    const easedSin = Math.sin(t);
    shoe.y = baselineY + easedSin * this.verticalAmplitude;
  }

  private async createActButton() {
    this.actButton.container.rotation = Math.PI / 2;

    this.app.stage.addChild(this.actButton.container);
    setTimeout(() => {
      this.replaceRandomShoeWithActButton(this.actButton);
    }, this.actButtonCountDown);
  }

  public async preparingHelp() {
    const decreaseShoeSpeed = (progress: number) => {
      this.shoeSpeed = lerp(2.6, 0, progress);
    };
    await animateWithTimer(3000, decreaseShoeSpeed);
  }

  public async helpUser() {
    this.verticalMoveDisabled = true;
    this.actButton.disappear();

    // targetY - на сколько пикселец поднимутся элементы
    const targetY = 150;
    // Начальная позиция по y оси = используется чтобы равномерно передвигались вверх
    const initialYPositions: { [index: number]: number } = {};
    this.shoes.forEach((shoe, index) => {
      initialYPositions[index] = shoe.y;
    });
    await animateWithTimer(500, (progress) => {
      this.shoes.forEach((shoe, index) => {
        shoe.y = initialYPositions[index] - targetY * progress;
      });
    });
  }

  destroy() {
    this.app.stage.removeChild(...this.shoes);
    this.actButton.container.destroy();
  }
}
