import * as PIXI from "pixi.js";
import { Application, Assets, Polygon, Sprite } from "pixi.js";

import glovePng from "../assets/img/glove.png";
import likePng from "../assets/img/like.png";

import { Heart } from "@/utils/items/Heart.ts";
import {
  animateWithTimer,
  callInfinitely,
  easeInOut,
  lerp,
} from "@/utils/helpers/timing.helper.ts";
import { getRandomIndex } from "@/utils/helpers/random.helper.ts";
import { Glove, LIKE_POLYGON } from "../assets/sprite/Glove.ts";
import {
  arePolygonsColliding,
  createTicker,
} from "@/utils/helpers/pixi.helper.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class GloveManager {
  public actButton = new ActButton();
  public gloveContainers: PIXI.Container<Sprite>[] = Array.from(
    { length: 6 },
    () => new PIXI.Container(),
  );
  private minRadius = 50;
  private maxRadius = 120;
  private rotationSpeed = 0.007;
  private ticker = createTicker();
  private stop: boolean = false;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly actButtonCountDown: number,
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const gloveTexture = await Assets.load(glovePng);

    const numSprites = 7;
    const angleStep = (2 * Math.PI) / numSprites;

    const screenWidth = this.app.renderer.width;
    const screenHeight = this.app.renderer.height;

    const numColumns = 3;
    const numRows = 3;
    const containerWidth = 0;
    const containerHeight = -350;

    const totalGridWidth = numColumns + containerWidth;
    const totalGridHeight = numRows + containerHeight;

    const offsetX = (screenWidth - totalGridWidth) / 2;
    const offsetY = (screenHeight - totalGridHeight) / 2;

    for (let i = 0; i < this.gloveContainers.length; i++) {
      const container = this.gloveContainers[i];

      const row = Math.floor(i / numColumns);
      const column = i % numColumns;

      const y = row * offsetY + (column === 1 ? 250 : 150);
      const x = column * offsetX;

      container.x = x;
      container.y = y;
      container.label = `${column}`;

      for (let j = 0; j < numSprites; j++) {
        const angle = j * angleStep;

        const glove = new Glove({ texture: gloveTexture });

        const sprite = glove.container;

        sprite.pivot.set(sprite.width / 2, sprite.height);
        sprite.rotation = angle + Math.PI / 2;

        sprite.label = `${i}`;

        container.addChild(sprite);
      }

      this.animateRadius(container);
      this.animateContainerRotation(container);
      this.app.stage.addChild(container);
    }
    return this.createActButton();
  }

  animateRadius(container: PIXI.Container<Sprite>) {
    const duration = 1500;

    const animateRadiusChange = async (
      startRadius: number,
      endRadius: number,
    ) => {
      await animateWithTimer(
        duration,
        (progress) => {
          if (this.stop) return;
          const angleStep = (2 * Math.PI) / 7;

          const currentRadius = lerp(startRadius, endRadius, progress);
          container.children.forEach((glove, j) => {
            const angle = j * angleStep;

            glove.x = currentRadius * Math.cos(angle);
            glove.y = currentRadius * Math.sin(angle);
          });
        },
        easeInOut,
      );
    };

    callInfinitely(async () => {
      await animateRadiusChange(this.minRadius, this.maxRadius);
      await animateRadiusChange(this.maxRadius, this.minRadius);
    }, !this.stop);
  }

  animateContainerRotation(container: PIXI.Container) {
    this.ticker.add(() => {
      container.rotation += this.rotationSpeed;
      if (container.rotation >= 2 * Math.PI) {
        container.rotation -= 2 * Math.PI;
      }
      container.y += 1;

      if (container.y > this.app.renderer.height) {
        container.y = -container.height;
      }
    });
    this.ticker.start();
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
    const randomContainerIndex = getRandomIndex(this.gloveContainers);
    this.gloveContainers[randomContainerIndex].addChild(
      this.actButton.container,
    );

    setTimeout(() => {
      this.replaceWithActButton(this.actButton, randomContainerIndex);
    }, this.actButtonCountDown);
  }

  async helpUser() {
    const likeTexture = await Assets.load(likePng);
    this.gloveContainers.forEach((gloveContainer) => {
      return gloveContainer.children.forEach((glove) => {
        if (glove.label === "act-button") return;
        glove.hitArea = new Polygon(LIKE_POLYGON);
        glove.texture = likeTexture;

        glove.tint = "#07a108";
      });
    });
  }

  destroy() {
    this.ticker.stop();
    this.ticker.destroy();
    this.app.stage.removeChild(...this.gloveContainers);
    this.gloveContainers.forEach((c) => c.destroy());
    this.stop = true;
    this.actButton.container.destroy();
  }
}
