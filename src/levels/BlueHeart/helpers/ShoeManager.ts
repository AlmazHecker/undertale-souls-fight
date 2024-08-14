import { Heart } from "@/utils/items/Heart.ts";

import * as PIXI from "pixi.js";
import { Application, Assets, Sprite } from "pixi.js";
import shoePng from "../assets/img/shoe.png";

import { Shoe } from "../assets/sprite/Shoe.ts";
import { ActButton } from "@/utils/items/ActButton.ts";
import {
  arePolygonsColliding,
  createTicker,
} from "@/utils/helpers/pixi.helper.ts";
import { animateWithTimer, lerp } from "@/utils/helpers/timing.helper.ts";

export class ShoeManager {
  private spriteYMap = new Map<PIXI.Sprite, number>();
  private bottomOffset = 50;
  private shoeSpacing = 20;
  private shoeSpeed = 2.3;
  private shoeWidth = 70;
  private shoeHeight = 150;
  public actButton = new ActButton();
  private actButtonOffset = 20; // Offset for actButtonSprite to appear lower
  private verticalMoveDisabled: boolean = false;

  private readonly shoes: Sprite[] = [];
  private readonly defaultY: number;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly actButtonCountDown: number,
  ) {
    this.defaultY =
      this.app.renderer.height - this.shoeHeight - this.bottomOffset;
  }

  async initialize() {
    await this.actButton.initialize();
    const numShoesX =
      Math.floor(
        this.app.renderer.width / (this.shoeWidth + this.shoeSpacing),
      ) + 1;
    const shoeTexture = await Assets.load(shoePng);

    for (let i = 0; i < numShoesX; i++) {
      const x =
        this.app.renderer.width + i * (this.shoeWidth + this.shoeSpacing);
      const y = this.defaultY;
      const shoe = new Shoe(x, y, shoeTexture);
      this.app.stage.addChild(shoe.container);
      this.shoes.push(shoe.container);
      setTimeout(() => {
        this.startVerticalMovement(shoe.container, this.bottomOffset);
      }, 500 * i);
    }

    await this.createActButton();
  }

  public replaceRandomShoeWithActButton(actButton: ActButton) {
    const randomIndex = Math.floor(Math.random() * this.shoes.length);
    const shoe = this.shoes[randomIndex];

    actButton.container.x = shoe.x + this.shoeWidth / 2;
    actButton.container.y =
      this.defaultY + this.shoeHeight / 2 + this.actButtonOffset;

    actButton.container.visible = true;
    this.startVerticalMovement(actButton.container, this.bottomOffset);
    this.app.stage.removeChild(shoe);
    this.shoes[randomIndex] = actButton.container;
  }

  public infiniteShoesLogic() {
    const collisions: Sprite[] = [];
    const { shoes, shoeSpeed, shoeWidth, shoeSpacing, actButton, heart } = this;
    const lastShoeX = shoes[shoes.length - 1].x;

    for (let i = 0; i < shoes.length; i++) {
      const shoe = shoes[i];
      shoe.x -= shoeSpeed;
      if (shoe.x + shoeWidth < 0) {
        shoe.x = lastShoeX + shoeWidth + shoeSpacing;

        if (shoe.label === "act-button") {
          actButton.container.x = shoe.x + shoeWidth / 2;
        }

        shoes.push(shoes.splice(i, 1)[0]);
        i--;
        continue;
      }

      if (shoe.label !== "act-button") {
        const isDamaged = arePolygonsColliding(shoe, heart.container);
        if (isDamaged) collisions.push(shoe);
      }
    }

    return collisions;
  }

  private async createActButton() {
    this.actButton.container.rotation = Math.PI / 2;

    this.app.stage.addChild(this.actButton.container);
    setTimeout(() => {
      this.replaceRandomShoeWithActButton(this.actButton);
    }, this.actButtonCountDown);
  }

  private startVerticalMovement(sprite: PIXI.Sprite, bottomOffset: number) {
    if (!this.spriteYMap.has(sprite)) {
      this.spriteYMap.set(sprite, sprite.y);
    }
    const originalY = this.spriteYMap.get(sprite)!;
    const downY = originalY + bottomOffset;
    const moveSpeed = 1.5;
    let movingDown = true;

    const moveTicker = createTicker();
    moveTicker.add(() => {
      if (this.verticalMoveDisabled) {
        return moveTicker.destroy();
      }

      sprite.y += movingDown ? moveSpeed : -moveSpeed;

      if (movingDown && sprite.y >= downY) {
        movingDown = false;
      } else if (!movingDown && sprite.y <= originalY) {
        moveTicker.destroy();
        this.startVerticalMovement(sprite, bottomOffset);
      }
    });
    moveTicker.start();

    return moveTicker;
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
