import { Heart } from "@/utils/items/Heart.tsx";
import { Application, Assets, Polygon, Sprite, Texture } from "pixi.js";

import {
  animateWithTimer,
  callInfinitely,
} from "@/utils/helpers/timing.helper.ts";

import {
  getRandomBoolean,
  getRandomInRange,
} from "@/utils/helpers/random.helper.ts";
import { arePolygonsColliding } from "@/utils/helpers/pixi.helper.ts";
import { Pan } from "@/levels/GreenHeart/assets/sprite/Pan.ts";
import { EGG_POLYGON, Fire } from "@/levels/GreenHeart/assets/sprite/Fire.ts";
import { ActButton } from "@/utils/items/ActButton.ts";
import { GLOBAL_SCALE, HEIGHT, WIDTH } from "@/config/engine";
import { BaseItem } from "@/core/BaseItem";

type FireState = {
  sprite: Sprite;
  startX: number;
  startY: number;
  vx: number;
  riseT: number; // 0 → 1
  fallT: number; // 0 → 1
  phase: "RISING" | "FALLING";
  remove: boolean;
};

export class PanManager {
  public actButton = new ActButton();

  private fireTexture?: Texture;
  private eggTexture?: Texture;
  private status: "IDLE" | "HELPING" | "DESTROY" = "IDLE";

  private readonly pans: Pan[] = [];
  private readonly spacing = 50 * GLOBAL_SCALE;
  private readonly riseDistance = 70 * GLOBAL_SCALE;
  private readonly horizontalFireMovement = 170 * GLOBAL_SCALE;

  private fires: FireState[] = [];

  constructor(
    private readonly app: Application,
    private readonly heart: Heart
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const assets = await Assets.loadBundle("green");
    this.fireTexture = assets.fire;
    this.eggTexture = assets.egg;
    const panTexture = assets.pan;

    const itemCount = 3;
    const panWidth = Pan.width * GLOBAL_SCALE;

    const totalWidth = panWidth * itemCount + this.spacing * itemCount;
    const pivotOffset = Pan.width - 70;
    const startX = (WIDTH - totalWidth) / 2 + pivotOffset * GLOBAL_SCALE * 1.5;

    for (let i = 0; i < itemCount; i++) {
      const x = startX + i * (panWidth + this.spacing);

      const y = 150 * GLOBAL_SCALE;
      const pan = new Pan({ texture: panTexture, x, y });
      pan.container.scale.set(GLOBAL_SCALE * 1.5);
      pan.container.pivot.set(Pan.width - 70, 0);
      this.animatePanRotation(pan);
      this.app.stage.addChild(pan.container);
      this.pans.push(pan);
    }

    this.generateFire();
  }

  private spawnFire(x: number, y: number, item: BaseItem) {
    const moveRight = getRandomBoolean();
    const vx = moveRight
      ? this.horizontalFireMovement
      : -this.horizontalFireMovement;

    this.fires.push({
      sprite: item.container,
      startX: x,
      startY: y,
      vx,
      riseT: 0,
      fallT: 0,
      phase: "RISING",
      remove: false,
    });
  }

  public updateFires(dt: number) {
    for (let i = this.fires.length - 1; i >= 0; i--) {
      const f = this.fires[i];

      if (f.phase === "RISING") {
        f.riseT += dt * 0.004;
        if (f.riseT >= 1) {
          f.riseT = 1;
          f.phase = "FALLING";
        }
        f.sprite.y = f.startY - this.riseDistance * f.riseT;
      }

      if (f.phase === "FALLING") {
        f.fallT += dt * 0.0003;
        const gravity = f.fallT * f.fallT * HEIGHT;
        f.sprite.x = f.startX + f.vx * f.fallT;
        f.sprite.y = f.startY - this.riseDistance + gravity;
        f.sprite.alpha = 1 - f.fallT;

        if (f.fallT >= 1) f.remove = true;
      }

      if (f.remove) {
        this.app.stage.removeChild(f.sprite);
        this.fires.splice(i, 1);
      }
    }
  }

  public checkCollisions() {
    const collisions: Sprite[] = [];
    this.app.stage.children.forEach((sprite) => {
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
      const interval = getRandomInRange(300, 700);
      const timerId = setInterval(() => {
        if (this.status === "DESTROY") return clearTimeout(timerId);
        count++;

        const x =
          pan.container.x -
          (Pan.width * GLOBAL_SCALE * 1.5) / 2 +
          getRandomInRange(-20, 20);
        const y = pan.container.y;

        const fire = new Fire({ texture: this.fireTexture!, x, y });
        fire.container.scale.set(GLOBAL_SCALE * 2);
        if (this.status === "HELPING") this.replaceFireWithEgg(fire.container);

        this.app.stage.addChild(fire.container);
        this.spawnFire(x, y, fire);

        if (count % 80 === 0 && count !== 0 && this.status !== "HELPING") {
          this.createActButton(x, y);
          this.spawnFire(x, y, this.actButton);

          this.app.stage.addChild(this.actButton.container);
          count = 0;
        }
      }, interval);
    });
  }

  public replaceFireWithEgg(fire: Sprite) {
    fire.texture = this.eggTexture!;
    fire.label = "egg";
    fire.tint = "#07a108";
    fire.width = 80;
    fire.height = 54;
    fire.hitArea = new Polygon(EGG_POLYGON);
  }

  private createActButton(x: number, y: number) {
    this.actButton.container.pivot = 0;
    this.actButton.container.visible = true;
    this.actButton.container.rotation = Math.PI / 2;
    this.actButton.container.position.set(x, y);
    this.actButton.container.scale.set(GLOBAL_SCALE);
  }

  animatePanRotation(pan: Pan) {
    const rotationDuration = 200;
    const wiggleDuration = 200;
    const startX = pan.container.x;
    const startY = pan.container.y;

    let wiggleDirection = 20;
    const animate = async () => {
      await animateWithTimer(wiggleDuration, (progress) => {
        pan.container.x = startX + wiggleDirection * progress;
        const lift = Math.sin(progress * Math.PI) * 5; // Slight lift to mimic real movement
        pan.container.y = startY - lift;
      });

      pan.container.x = startX + wiggleDirection;

      await animateWithTimer(rotationDuration, (progress) => {
        pan.container.rotation = progress * (Math.PI / 9);
      });
      await animateWithTimer(rotationDuration, (progress) => {
        pan.container.rotation = (1 - progress) * (Math.PI / 9);
      });
      wiggleDirection = wiggleDirection === -20 ? 20 : -20;
    };
    callInfinitely(animate, this.status !== "DESTROY");
  }

  public async helpUser() {
    this.status = "HELPING";
    this.fires.forEach(({ sprite }) => {
      this.replaceFireWithEgg(sprite);
    });
  }

  destroy() {
    this.status = "DESTROY";
    this.pans.forEach((pan) => {
      pan.container.destroy();
      this.app.stage.removeChild(pan.container);
    });
    this.fires.forEach(({ sprite }) => {
      sprite.destroy();
      this.app.stage.removeChild(sprite);
    });
    this.actButton.container.destroy();
  }
}
