import * as PIXI from "pixi.js";
import { Application, Assets, Polygon, Sprite, Texture } from "pixi.js";

import { Heart } from "@/utils/items/Heart.ts";
import { getRandomIndex } from "@/utils/helpers/random.helper.ts";
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
  private minRadius = 120 * GLOBAL_SCALE;
  private maxRadius = 200 * GLOBAL_SCALE;
  private rotationSpeed = 0.007;
  private likeTexture!: Texture;

  private rowSpacing!: number;
  private columnHeight!: number;
  private numColumns = 3;
  private numRows = 3;

  private radiusTime = 0;
  private radiusSpeed = (Math.PI * 2) / 2000; // 2000ms full cycle
  private angleStep = (2 * Math.PI) / 7;
  private numGlovesPerContainer = 7;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly actButtonCountDown: number
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const assets = await Assets.loadBundle("orange");
    this.likeTexture = assets.like;

    const containerHeight = -350 * GLOBAL_SCALE;
    const totalGridHeight = this.numRows + containerHeight;

    const horizontalSpacing = 450 * GLOBAL_SCALE; // fixed spacing, scales with canvas
    const totalGridWidth = (this.numColumns - 1) * horizontalSpacing;
    const startX = (WIDTH - totalGridWidth) / 2;
    const offsetY = (HEIGHT - totalGridHeight) / 2;

    for (let i = 0; i < this.gloveContainers.length; i++) {
      const container = this.gloveContainers[i];

      const row = Math.floor(i / this.numColumns);
      const col = i % this.numColumns;

      container.y = row * offsetY + 150;
      container.x = startX + col * horizontalSpacing;

      this.rowSpacing = offsetY;
      this.columnHeight = this.rowSpacing * this.numRows;

      for (let j = 0; j < this.numGlovesPerContainer; j++) {
        const angle = j * this.angleStep;

        const glove = new Glove({ texture: assets.glove });
        const sprite = glove.container;

        glove.centerWithPivot();
        glove.container.scale.set(GLOBAL_SCALE);

        sprite.rotation = angle + Math.PI / 2;

        container.addChild(sprite);
      }

      this.app.stage.addChild(container);
    }
    getGlobalTicker().add(this.startAnimation, this);
    return this.createActButton();
  }

  startAnimation(ticker: PIXI.Ticker) {
    // radius update
    this.radiusTime += ticker.deltaMS;
    const t = (this.radiusTime * this.radiusSpeed) % (Math.PI * 2);
    const osc = (1 - Math.cos(t)) * 0.5; // Very cool trick. Oscillates between 0 and 1
    const radius = this.minRadius + osc * (this.maxRadius - this.minRadius);

    // update all containers
    for (let c = 0; c < this.gloveContainers.length; c++) {
      const container = this.gloveContainers[c];

      container.rotation += this.rotationSpeed;
      if (container.rotation >= 2 * Math.PI) {
        container.rotation -= 2 * Math.PI;
      }

      container.y += 1;

      const visualTop = container.y - this.maxRadius;
      if (visualTop > HEIGHT) {
        container.y -= this.columnHeight;
      }

      // update children radius positions
      const children = container.children;
      for (let j = 0; j < children.length; j++) {
        const glove = children[j];
        const angle = j * this.angleStep;

        glove.x = radius * Math.cos(angle);
        glove.y = radius * Math.sin(angle);
      }
    }
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
    const indexes = [1, 4, 7];
    const randomContainerIndex = indexes[getRandomIndex(indexes)];
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
    getGlobalTicker().remove(this.startAnimation, this);

    this.app.stage.removeChild(...this.gloveContainers);
    this.gloveContainers.forEach((c) => c.destroy());
    this.actButton.container.destroy();
  }
}
