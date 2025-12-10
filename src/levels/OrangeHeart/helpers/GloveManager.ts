import * as PIXI from "pixi.js";
import { Application, Assets, Polygon, Sprite, Texture } from "pixi.js";

import { Heart } from "@/utils/items/Heart.ts";
import {
  animateWithTimer,
  callInfinitely,
  easeInOut,
  lerp,
} from "@/utils/helpers/timing.helper.ts";
import {
  getRandomBoolean,
  getRandomIndex,
} from "@/utils/helpers/random.helper.ts";
import { Glove, LIKE_POLYGON } from "../assets/sprite/Glove.ts";
import {
  arePolygonsColliding,
  getGlobalTicker,
} from "@/utils/helpers/pixi.helper.ts";
import { ActButton } from "@/utils/items/ActButton.ts";
import { GLOBAL_SCALE as SC, HEIGHT, WIDTH } from "@/config/engine.ts";

const GLOBAL_SCALE = SC * 1.2;

export class GloveManager {
  public actButton = new ActButton();
  public gloveContainers: PIXI.Container<Sprite>[] = Array.from(
    { length: 9 },
    () => new PIXI.Container()
  );
  private minRadius = 100 * GLOBAL_SCALE;
  private maxRadius = 200 * GLOBAL_SCALE;
  private rotationSpeed = 0.007;
  private stop: boolean = false;
  private likeTexture!: Texture;
  private rowSpacing!: number;
  private columnHeight!: number;

  private numColumns = 3;
  private numRows = 3;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly actButtonCountDown: number
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const assets = await Assets.loadBundle("orange");
    this.likeTexture = assets.like;

    const numSprites = 7;
    const angleStep = (2 * Math.PI) / numSprites;

    const containerWidth = 0;
    const containerHeight = -350 * GLOBAL_SCALE;

    const totalGridWidth = this.numColumns + containerWidth;
    const totalGridHeight = this.numRows + containerHeight;

    const offsetX = (WIDTH - totalGridWidth) / 2;
    const offsetY = (HEIGHT - totalGridHeight) / 2;

    for (let i = 0; i < this.gloveContainers.length; i++) {
      const container = this.gloveContainers[i];

      const row = Math.floor(i / this.numColumns);
      const column = i % this.numColumns;

      const y = row * offsetY + 100;
      const x = column * offsetX;

      container.x = x;
      container.y = y;
      container.label = `${column}`;

      this.rowSpacing = offsetY;
      this.columnHeight = this.rowSpacing * this.numRows;

      for (let j = 0; j < numSprites; j++) {
        const angle = j * angleStep;

        const glove = new Glove({ texture: assets.glove });
        const sprite = glove.container;

        glove.centerWithPivot();
        glove.container.scale.set(GLOBAL_SCALE);

        sprite.rotation = angle + Math.PI / 2;

        sprite.label = `${i}`;

        container.addChild(sprite);
      }

      this.animateRadius(container);
      this.app.stage.addChild(container);
    }
    getGlobalTicker().add(this.animateContainersRotation, this);
    return this.createActButton();
  }

  animateRadius(container: PIXI.Container<Sprite>) {
    const duration = 1500;

    const animateRadiusChange = async (
      startRadius: number,
      endRadius: number
    ) => {
      await animateWithTimer(
        duration,
        (progress, destroy) => {
          if (this.stop) return destroy();
          const angleStep = (2 * Math.PI) / 7;

          const currentRadius = lerp(startRadius, endRadius, progress);
          container.children.forEach((glove, j) => {
            const angle = j * angleStep;

            glove.x = currentRadius * Math.cos(angle);
            glove.y = currentRadius * Math.sin(angle);
          });
        },
        easeInOut
      );
    };

    callInfinitely(async () => {
      await animateRadiusChange(this.minRadius, this.maxRadius);
      await animateRadiusChange(this.maxRadius, this.minRadius);
    }, !this.stop);
  }
  animateContainersRotation() {
    const screenH = this.app.renderer.height;

    this.gloveContainers.forEach((container) => {
      container.rotation += this.rotationSpeed;
      if (container.rotation >= 2 * Math.PI) {
        container.rotation -= 2 * Math.PI;
      }

      container.y += 1;

      const visualTop = container.y - this.maxRadius;

      if (visualTop > screenH) {
        container.y -= this.columnHeight;
      }
    });
  }

  public checkCollisions() {
    const collisions: Sprite[] = [];

    this.gloveContainers.forEach((gloveContainer) => {
      gloveContainer.children.forEach((glove) => {
        if (glove?.label === "act-button" || !glove.visible) return;
        const isDamaged = arePolygonsColliding(glove, this.heart.container);
        if (isDamaged) collisions.push(glove);
      });
    });

    return collisions;
  }

  public replaceWithActButton(actButton: ActButton, containerIndex: number) {
    const container = this.gloveContainers[containerIndex];
    const itemIdx = getRandomIndex(container.children);
    const sprite = this.gloveContainers[containerIndex].children[itemIdx];
    actButton.container.rotation = sprite.rotation + Math.PI / 2;
    actButton.container.x = sprite.x;
    actButton.container.y = sprite.y;
    sprite.visible = false;
    container.swapChildren(sprite, actButton.container);

    this.gloveContainers[containerIndex].removeChild(sprite);

    actButton.container.visible = true;
  }

  private createActButton() {
    const randomContainerIndex = getRandomBoolean() ? 1 : 4;
    this.gloveContainers[randomContainerIndex].addChild(
      this.actButton.container
    );

    setTimeout(() => {
      this.replaceWithActButton(this.actButton, randomContainerIndex);
    }, this.actButtonCountDown);
  }

  async helpUser() {
    this.gloveContainers.forEach((gloveContainer) => {
      return gloveContainer.children.forEach((glove) => {
        if (glove.label === "act-button") return;
        glove.hitArea = new Polygon(LIKE_POLYGON);
        glove.texture = this.likeTexture;
        glove.scale.set(GLOBAL_SCALE);

        glove.tint = "#07a108";
      });
    });
  }

  destroy() {
    getGlobalTicker().remove(this.animateContainersRotation, this);

    this.app.stage.removeChild(...this.gloveContainers);
    this.gloveContainers.forEach((c) => c.destroy());
    this.stop = true;
    this.actButton.container.destroy();
  }
}
