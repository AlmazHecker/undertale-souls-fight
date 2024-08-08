import { Heart } from "@/utils/items/Heart.tsx";
import { Application, Assets, Sprite, Texture } from "pixi.js";
import panPng from "@/levels/GreenHeart/assets/img/pan.png";
import firePng from "@/levels/GreenHeart/assets/img/fire.png";
import eggPng from "@/levels/GreenHeart/assets/img/egg.png";

import {
  animateWithTimer,
  callInfinitely,
} from "@/utils/helpers/timing.helper.ts";

import {
  getRandomBoolean,
  getRandomInRange,
} from "@/utils/helpers/random.helper.ts";
import actPng from "@/assets/fight/act.png";
import { arePolygonsColliding } from "@/utils/helpers/pixi.helper.ts";
import { Pan } from "@/levels/GreenHeart/assets/sprite/Pan.ts";
import { Fire } from "@/levels/GreenHeart/assets/sprite/Fire.ts";
import { Egg } from "@/levels/GreenHeart/assets/sprite/Egg.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class PanManager {
  public actButton!: ActButton;

  private pans: Pan[] = [];
  private fireTexture?: Texture;
  private actButtonTexture?: Texture;
  private eggTexture?: Texture;
  private isHelping: boolean = false;

  private readonly spacing = 50;
  private readonly panWidth = 190;
  private readonly panHeight = 30;
  private readonly riseDistance = 70;
  private readonly fallDistance;
  private readonly horizontalFireMovement = 170;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {
    this.fallDistance = this.app.renderer.height + this.riseDistance;
  }

  async initialize() {
    this.fireTexture = await Assets.load(firePng);
    this.actButtonTexture = await Assets.load(actPng);
    this.eggTexture = await Assets.load(eggPng);
    const panTexture = await Assets.load(panPng);

    const itemCount = 3;
    const totalWidth = this.app.renderer.width;
    const totalItemWidth = this.panWidth * itemCount;
    const totalSpacing = (itemCount - 1) * this.spacing;
    const startX = (totalWidth - (totalItemWidth + totalSpacing)) / 2;

    for (let i = 0; i < itemCount; i++) {
      const x = startX + i * (this.panWidth + this.spacing);
      const y = 150;
      const pan = new Pan({
        texture: panTexture,
        width: this.panWidth,
        height: this.panHeight,
        x: x + this.panWidth,
        y,
      });

      pan.container.pivot.set(this.panWidth - 70, 0);
      this.animatePanRotation(pan);
      this.app.stage.addChild(pan.container);
      this.pans.push(pan);
    }

    return this.generateFire();
  }

  async animateFireRiseAndFall(fire: Fire) {
    const moveRight = getRandomBoolean();
    if (!moveRight) {
      fire.container.scale.x *= -1; // Mirror the fire if moving left
    }

    const startY = fire.container.y;
    const startX = fire.container.x;
    const horizontalOffset = moveRight
      ? this.horizontalFireMovement
      : -this.horizontalFireMovement;
    await animateWithTimer(300, (progress, destroy) => {
      if (this.isHelping && fire.container.label === "fire") {
        destroy();
      } else {
        fire.container.y = startY - this.riseDistance * progress;
      }
    });

    await animateWithTimer(3000, (progress, destroy) => {
      if (this.isHelping && fire.container.label === "fire") {
        destroy();
      } else {
        fire.container.x = startX + horizontalOffset * progress;
        const gravityEffect = Math.pow(progress, 2); // Simulate gravity
        fire.container.y =
          startY - this.riseDistance + this.fallDistance * gravityEffect;
      }
      if (fire.container.label !== "act-button") {
        fire.container.alpha = 1 - progress;
      }
    });
    this.app.stage.removeChild(fire.container);
  }

  public checkCollisions() {
    const collisions: Sprite[] = [];
    this.app.stage.children.forEach((sprite) => {
      if (sprite?.label === "act-button") return;
      if (sprite.label === "fire" || sprite.label === "egg") {
        const isDamaged = arePolygonsColliding(sprite, this.heart.container);
        if (isDamaged) collisions.push(sprite as Sprite);
      }
    });

    return collisions;
  }

  private generateFire() {
    let count = 0;

    this.pans.forEach((pan) => {
      const y = pan.container.y;

      const randomInterval = getRandomInRange(300, 700);

      setInterval(() => {
        const baseX = pan.container.x - (pan.container.width / 2 + 20);
        const randomOffset = getRandomBoolean() ? -20 : 0;
        const x = baseX + randomOffset;
        count++;

        if (this.isHelping) {
          const egg = new Egg({
            texture: this.eggTexture!,
            x,
            y,
          });
          egg.container.tint = "#07a108";

          this.app.stage.addChild(egg.container);
          return this.animateFireRiseAndFall(egg);
        }
        if (count % 80 === 0 && count !== 0) {
          this.createActButton(this.actButtonTexture!, x, y);
          this.app.stage.addChild(this.actButton.container);

          return this.animateFireRiseAndFall(this.actButton);
        }

        const fire = new Fire({
          texture: this.fireTexture!,
          x,
          y,
        });

        this.app.stage.addChild(fire.container);
        this.animateFireRiseAndFall(fire);
      }, randomInterval);
    });
  }

  private createActButton(actButtonTexture: Texture, x: number, y: number) {
    this.actButton = new ActButton(actButtonTexture);
    this.actButton.container.zIndex = 5;
    this.actButton.container.pivot = 0;
    this.actButton.container.visible = true;
    this.actButton.container.rotation = Math.PI / 2;
    this.actButton.container.x = x;
    this.actButton.container.y = y;
  }

  animatePanRotation(pan: Pan) {
    const rotationDuration = 200;
    const wiggleDuration = 200;
    const startX = pan.container.x;
    const startY = pan.container.y;

    let wiggleDirection = 20;
    const animate = async () => {
      await animateWithTimer(wiggleDuration, (progress) => {
        const currentWiggle = startX + wiggleDirection * progress;
        pan.container.x = currentWiggle;
        const lift = Math.sin(progress * Math.PI) * 5; // Slight lift to mimic real movement
        pan.container.y = startY - lift;
      });

      pan.container.x = startX + wiggleDirection;

      await animateWithTimer(rotationDuration, (progress) => {
        const angle = progress * (Math.PI / 9); // 20 degrees
        pan.container.rotation = angle;
      });
      await animateWithTimer(rotationDuration, (progress) => {
        const angle = (1 - progress) * (Math.PI / 9);
        pan.container.rotation = angle;
      });
      wiggleDirection = wiggleDirection === -20 ? 20 : -20;
    };
    callInfinitely(animate, true);
  }

  public async helpUser() {
    this.isHelping = true;
  }

  destroy() {
    this.pans.forEach((pan) => {
      pan.container.destroy();
      this.app.stage.removeChild(pan.container);
    });
    this.fireTexture?.destroy();
    this.eggTexture?.destroy();
    if (this.actButton) this.actButton.container.destroy();
  }
}
