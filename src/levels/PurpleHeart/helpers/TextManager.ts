import * as PIXI from "pixi.js";
import { Application, Container, Sprite } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import {
  areRectanglesColliding,
  createTicker,
} from "@/utils/helpers/pixi.helper.ts";

import {
  getRandomBoolean,
  getRandomIndex,
} from "@/utils/helpers/random.helper.ts";
import { vibrate } from "@/utils/helpers/timing.helper.ts";
import {
  BAD_WORDS,
  GOOD_WORDS,
} from "@/levels/PurpleHeart/helpers/constants.ts";
import { Text } from "@/levels/PurpleHeart/assets/sprite/Text.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class TextManager {
  public actButton = new ActButton();
  public texts: PIXI.Text[] = [];
  private textHeight = 50;
  private textSpacing = 0;
  private moveSpeed = 2;
  private activeWords: string[] = BAD_WORDS;
  private yAxis: number[] = [];
  private stop: boolean = false;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const numTextsY = Math.ceil(
      this.app.renderer.height / (this.textHeight + 10),
    );

    for (let y = 0; y <= numTextsY; y++) {
      const text = new Text(
        this.activeWords[getRandomIndex(this.activeWords)],
        0,
        y * (this.textHeight + this.textSpacing),
      );

      this.yAxis.push(text.text.y);

      text.text.style.fontSize = 45;
      text.text.height = this.textHeight;
      setTimeout(() => {
        this.startHorizontalMovement(text.text);
      }, Math.random() * 200);
      this.texts.push(text.text);

      this.app.stage.addChild(text.text);
    }

    return this.createActButton();
  }

  public infiniteTextAnimation() {
    const collisions: Container[] = [];

    this.texts.forEach((text) => {
      const isDamaged = areRectanglesColliding(text, this.heart.container, {
        top: 10,
        bottom: 10,
      });
      if (isDamaged) collisions.push(text);
    });

    return collisions;
  }

  public async createActButton() {
    this.actButton.container.zIndex = 2;
    this.actButton.container.pivot = 0;
    this.actButton.container.height = this.textHeight;
    this.app.stage.addChild(this.actButton.container);
    setTimeout(() => {
      this.replaceRandomTextWithActButton(this.actButton);
    }, 10000);
  }

  public replaceRandomTextWithActButton(actButton: ActButton) {
    const randomIndex = Math.floor(Math.random() * this.texts.length);
    const text = this.texts[randomIndex];
    actButton.container.position.set(text.x, text.y);
    actButton.container.visible = true;
    this.startHorizontalMovement(actButton.container);
    this.app.stage.removeChild(text);
    this.texts.splice(randomIndex, 1);
  }

  startHorizontalMovement(text: PIXI.Text | Sprite) {
    const startX = 200;
    const endX = this.app.screen.width - 200;
    let movingRight = getRandomBoolean();

    const moveTicker = createTicker();

    moveTicker.add(() => {
      if (this.stop) return moveTicker.stop();
      text.x += movingRight ? this.moveSpeed : -this.moveSpeed;
      if (
        (movingRight && text.x > endX) ||
        (!movingRight && text.x < startX - text.width)
      ) {
        moveTicker.stop();

        setTimeout(() => {
          if (this.stop) return moveTicker.stop();

          if (text instanceof PIXI.Text) {
            text.text = this.activeWords[getRandomIndex(this.activeWords)];
          }

          movingRight = getRandomBoolean();
          text.x = movingRight ? startX - text.width : endX;
          moveTicker.start();
        }, Math.random() * 2000);
      }
    });

    moveTicker.start();
  }

  public async preparingHelp() {
    this.texts.map((text) => {
      const originalY = text.y;
      return vibrate({ container: text, duration: 3000, y: originalY });
    });
  }

  public async helpUser() {
    this.activeWords = GOOD_WORDS;
    this.actButton.disappear();

    this.texts.forEach((text, index) => {
      text.tint = "#07a108";
      text.text = GOOD_WORDS[getRandomIndex(GOOD_WORDS)];
      text.y = this.yAxis[index];
    });
  }

  public removeText(text: Container) {
    if (text instanceof PIXI.Text) {
      this.texts = this.texts.filter((t) => t !== text);
      this.app.stage.removeChild(text);
    }
  }

  destroy() {
    this.stop = true;
    this.actButton.container.destroy();
    this.app.stage.removeChild(...this.texts);
    this.texts.forEach((text) => text.destroy());
  }
}
