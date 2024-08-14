import * as PIXI from "pixi.js";
import { Application, Assets, Sprite } from "pixi.js";
import knifePng from "../assets/img/knife.png";

import plasterPng from "../assets/img/plaster.png";
import {
  arePolygonsColliding,
  isOutOfCanvas,
} from "@/utils/helpers/pixi.helper.ts";
import { shuffleArray } from "@/utils/helpers/random.helper.ts";
import { animateWithTimer } from "@/utils/helpers/timing.helper.ts";
import { Heart } from "@/utils/items/Heart.ts";
import { Knife } from "@/levels/CyanHeart/assets/sprite/Knife.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class KnifeManager {
  public actButton = new ActButton();
  private knifeSpacing = 10;
  private rotationSpeed = 0.025;
  private moveDuration = 3000;
  private timerIds: ReturnType<typeof setTimeout>[] = [];

  public knifeContainer = new PIXI.Container<Sprite>();
  private stop: boolean = false;
  private stopRhombusMovement: boolean = false;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly actButtonCountDown: number,
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const knifeTexture = await Assets.load(knifePng);

    const numKnivesX = Math.ceil(
      this.app.renderer.width / (128 + this.knifeSpacing),
    );
    const numKnivesY = Math.ceil(
      this.app.renderer.height / (128 + this.knifeSpacing),
    );
    for (let y = 0; y <= numKnivesY; y++) {
      for (let x = 0; x <= numKnivesX; x++) {
        const knife = new Knife(
          knifeTexture,
          x * (128 + this.knifeSpacing),
          y * (128 + this.knifeSpacing),
        );

        this.knifeContainer.addChild(knife.container);
      }
    }
    this.app.stage.addChild(this.knifeContainer);

    this.startRhombusMovement();
    await this.createActButton();
  }

  public infiniteKnivesAnimation() {
    const collisions: Sprite[] = [];

    this.knifeContainer.children.forEach((knife) => {
      knife.rotation += this.rotationSpeed;

      if (knife?.label === "act-button") return;
      const isDamaged = arePolygonsColliding(knife, this.heart.container);
      if (isDamaged) collisions.push(knife);
    });

    return collisions;
  }

  private startRhombusMovement() {
    const sideLength =
      Math.min(this.app.renderer.width, this.app.renderer.height) * 0.5;
    const halfSide = sideLength / 2;

    const positions = [
      { x: -halfSide, y: 0 },
      { x: 0, y: -halfSide },
      { x: halfSide, y: 0 },
      { x: 0, y: halfSide },
    ];

    let index = 0;

    const moveContainer = async () => {
      if (this.stopRhombusMovement) return;
      const nextPosition = positions[index];
      const startX = this.knifeContainer.x;
      const startY = this.knifeContainer.y;
      const dx = nextPosition.x - startX;
      const dy = nextPosition.y - startY;

      await animateWithTimer(this.moveDuration, (progress, destroy) => {
        if (this.stopRhombusMovement) return destroy();
        this.knifeContainer.x = startX + dx * progress;
        this.knifeContainer.y = startY + dy * progress;
      });

      index = (index + 1) % positions.length;

      moveContainer();
    };

    moveContainer();
  }

  public async createActButton() {
    this.knifeContainer.addChild(this.actButton.container);
    setTimeout(() => {
      this.replaceRandomKnifeWithActButton(this.actButton);
    }, this.actButtonCountDown);
  }

  private getRandomKnifeIndex() {
    let index;
    let knife;

    do {
      index = Math.floor(Math.random() * this.knifeContainer.children.length);
      knife = this.knifeContainer.children[index];
    } while (isOutOfCanvas(knife, this.app));

    return knife;
  }
  public replaceRandomKnifeWithActButton(actButton: ActButton) {
    const knife = this.getRandomKnifeIndex();
    actButton.container.position.set(knife.x + 8 / 2, knife.y + 16 / 2);

    actButton.container.visible = true;
    actButton.container.rotation = knife.rotation;
    this.knifeContainer.removeChild(knife);
  }

  public async helpUser() {
    this.stopRhombusMovement = true;
    const plasterTexture = await Assets.load(plasterPng);

    const centerX = this.app.renderer.width / 2;
    const centerY = this.app.renderer.height / 2;

    const knives = shuffleArray(this.knifeContainer.children);
    for (let i = 0; i < knives.length; i++) {
      const knife = this.knifeContainer.children[i];
      if (knife.label === "act-button") continue;
      knife.texture = plasterTexture;
      knife.tint = "#07a108";

      const startX = knife.x;
      const startY = knife.y;
      const dx = centerX - startX;
      const dy = centerY - startY;

      const timerId = setTimeout(() => {
        animateWithTimer(3000, (progress, destroy) => {
          if (this.stop) return destroy();
          knife.x = startX + dx * progress;
          knife.y = startY + dy * progress;
        });
      }, i * 200);
      this.timerIds.push(timerId);
    }
  }

  destroy() {
    this.stop = true;
    this.knifeContainer.children.forEach((child) => {
      child.destroy();
    });

    this.timerIds.forEach((timerId) => {
      clearTimeout(timerId);
    });

    this.app.stage.removeChild(this.knifeContainer);
    this.knifeContainer.destroy();

    this.actButton.container.destroy();
  }
}
