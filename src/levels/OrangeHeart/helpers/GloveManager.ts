import * as PIXI from "pixi.js";
import { Application, Assets, Sprite } from "pixi.js";

import glovePng from "../assets/img/glove.png";
import likePng from "../assets/img/like.png";
import actPng from "../../../assets/fight/act.png";

import { Heart } from "@/utils/items/Heart.ts";
import {
  animateWithTimer,
  callInfinitely,
  easeInOut,
  lerp,
} from "@/utils/helpers/timing.helper.ts";
import { getRandomIndex } from "@/utils/helpers/random.helper.ts";
import { Glove } from "../assets/sprite/Glove.ts";
import {
  arePolygonsColliding,
  createTicker,
} from "@/utils/helpers/pixi.helper.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class GloveManager {
  public actButton!: ActButton;
  private gloveWidth = 104;
  private gloveHeight = 125;
  public gloveContainers: PIXI.Container<Sprite>[] = Array.from(
    { length: 6 },
    () => new PIXI.Container(),
  );
  private minRadius = 70;
  private maxRadius = 130;
  private rotationSpeed = 0.007;
  private ticker = createTicker();

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  async initialize() {
    const gloveTexture = await Assets.load(glovePng);

    const numSprites = 7;
    const angleStep = (2 * Math.PI) / numSprites;

    const screenWidth = this.app.renderer.width;
    const screenHeight = this.app.renderer.height;

    const numColumns = 3;
    const numRows = 3;
    const containerWidth = 150;
    const containerHeight = -350;

    const totalGridWidth = numColumns + containerWidth;
    const totalGridHeight = numRows + containerHeight;

    const offsetX = (screenWidth - totalGridWidth) / 2 + 50;
    const offsetY = (screenHeight - totalGridHeight) / 2;

    for (let i = 0; i < this.gloveContainers.length; i++) {
      const container = this.gloveContainers[i];

      const row = Math.floor(i / numColumns);
      const column = i % numColumns;

      const y = row * offsetY + (column === 1 ? 250 : 0);
      const x = column * offsetX;

      container.x = x;
      container.y = y;

      const baseRotation = 125 * (Math.PI / 180); // 90 degrees
      for (let j = 0; j < numSprites; j++) {
        const angle = j * angleStep;

        const glove = new Glove({
          texture: gloveTexture,
          width: this.gloveWidth,
          height: this.gloveHeight,
        });
        // TODO uncomment if you are debugging
        // glove.container.x = this.minRadius * Math.cos(angle);
        // glove.container.y = this.minRadius * Math.sin(angle);
        glove.container.pivot.set(0, this.gloveHeight / 2);
        glove.container.rotation = angle + baseRotation;
        glove.container.label = `${i}`;

        container.addChild(glove.container);
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
          const currentRadius = lerp(startRadius, endRadius, progress);
          container.children.forEach((glove) => {
            let originalRotation = glove.rotation - 120 * (Math.PI / 180); // Adjust rotation back
            if (glove.tint === 499976) {
              originalRotation = glove.rotation - 150 * (Math.PI / 180); // Adjust rotation back
            }
            glove.x = currentRadius * Math.cos(originalRotation);
            glove.y = currentRadius * Math.sin(originalRotation);
          });
        },
        easeInOut,
      );
    };

    callInfinitely(async () => {
      await animateRadiusChange(this.minRadius, this.maxRadius);
      await animateRadiusChange(this.maxRadius, this.minRadius);
    }, true);
  }

  animateContainerRotation(container: PIXI.Container) {
    this.ticker.add(() => {
      container.rotation += this.rotationSpeed;
      if (container.rotation >= 2 * Math.PI) {
        container.rotation -= 2 * Math.PI;
      }
    });
    this.ticker.start();
  }

  public checkCollisions() {
    const collisions: Sprite[] = [];

    this.gloveContainers.forEach((gloveContainer) => {
      gloveContainer.children.forEach((glove) => {
        if (glove?.label === "act-button") return;
        const isDamaged = arePolygonsColliding(glove, this.heart.container);
        if (isDamaged) collisions.push(glove);
      });
    });

    return collisions;
  }

  public replaceWithActButton(actButton: ActButton, containerIndex: number) {
    const randomContainer = this.gloveContainers[containerIndex];

    const randomIndex = getRandomIndex(randomContainer.children);
    const sprite = this.gloveContainers[containerIndex].children[randomIndex];
    actButton.container.x = sprite.x;
    actButton.container.y = sprite.y;
    actButton.container.rotation = sprite.rotation;
    this.gloveContainers[containerIndex].removeChild(sprite);

    actButton.container.visible = true;
  }

  private async createActButton() {
    const actButtonTexture = await Assets.load(actPng);
    this.actButton = new ActButton(actButtonTexture);
    const randomContainerIndex = getRandomIndex(this.gloveContainers);

    this.gloveContainers[randomContainerIndex].addChild(
      this.actButton.container,
    );

    setTimeout(() => {
      this.replaceWithActButton(this.actButton, randomContainerIndex);
    }, 1000);
  }

  async helpUser() {
    const likeTexture = await Assets.load(likePng);

    this.gloveContainers.forEach((gloveContainer) => {
      return gloveContainer.children.forEach((glove) => {
        if (glove.label === "act-button") return;
        glove.texture = likeTexture;
        this.minRadius = 50;

        glove.tint = "#07a108";
      });
    });
  }

  destroy() {
    this.ticker.stop();
    this.ticker.destroy();
    this.app.stage.removeChild(...this.gloveContainers);
    this.gloveContainers.forEach((c) => c.destroy());
    if (this.actButton) {
      this.actButton.container.destroy();
    }
  }
}
