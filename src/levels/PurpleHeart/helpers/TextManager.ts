import * as PIXI from "pixi.js";
import { Application, Container } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import { areRectanglesColliding } from "@/utils/helpers/pixi.helper.ts";

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
import { GLOBAL_SCALE, HEIGHT } from "@/config/engine";

export class TextManager {
  public actButton = new ActButton();
  private readonly textHeight = 40 * GLOBAL_SCALE;
  private readonly textSpacing = 0 * GLOBAL_SCALE;
  private readonly moveSpeed = 2 * GLOBAL_SCALE;
  private readonly yAxis: number[] = [];
  private texts: PIXI.Text[] = [];
  private textStates: boolean[] = [];
  private activeWords: string[] = BAD_WORDS;

  private readonly startX;
  private readonly endX;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly sideMargin: number,
    private readonly activeWidth: number,
    private readonly actButtonCountDown: number
  ) {
    this.startX = this.sideMargin;
    this.endX = this.sideMargin + this.activeWidth;
  }

  async initialize() {
    await this.actButton.initialize();

    const numTextsY = Math.ceil(HEIGHT / this.textHeight);

    for (let y = 0; y <= numTextsY; y++) {
      const text = new Text(
        this.activeWords[getRandomIndex(this.activeWords)],
        0,
        y * (this.textHeight + this.textSpacing)
      );

      this.yAxis.push(text.text.y);

      text.text.style.fontSize = 45 * GLOBAL_SCALE;
      text.text.height = this.textHeight;

      const direction = getRandomBoolean();
      this.textStates.push(direction);

      // initiallly X will be close to startX or endX so user will have some time to move
      const offsetRatio = Math.random() * 0.2;
      const distance = this.activeWidth;
      text.text.x = direction
        ? this.startX + distance * offsetRatio
        : this.endX - text.text.width - distance * offsetRatio;

      this.texts.push(text.text);

      this.app.stage.addChild(text.text);
    }

    return this.createActButton();
  }

  public infiniteTextAnimation() {
    this.startHorizontalMovement();
    const collisions: Container[] = [];

    this.texts.forEach((text) => {
      if (!(text instanceof PIXI.Text)) return;
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
    }, this.actButtonCountDown);
  }

  public replaceRandomTextWithActButton(actButton: ActButton) {
    const randomIndex = Math.floor(Math.random() * this.texts.length);
    const text = this.texts[randomIndex];
    actButton.container.position.set(text.x, text.y);
    actButton.container.visible = true;
    actButton.container.scale.set(GLOBAL_SCALE);

    this.app.stage.removeChild(text);
    // @ts-ignore
    this.texts[randomIndex] = actButton.container;
  }

  startHorizontalMovement() {
    this.texts.forEach((text, index) => {
      let movingRight = this.textStates[index];

      text.x += movingRight ? this.moveSpeed : -this.moveSpeed;

      if (
        (movingRight && text.x + text.width >= this.endX) ||
        (!movingRight && text.x <= this.startX)
      ) {
        text.text = this.activeWords[getRandomIndex(this.activeWords)];

        const shouldFlip = getRandomBoolean();
        this.textStates[index] = shouldFlip ? !movingRight : movingRight;

        text.x = this.textStates[index] ? this.startX : this.endX - text.width;
      }
    });
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
    if (!(text instanceof PIXI.Text)) return;
    const index = this.texts.findIndex((t) => t === text);

    if (index === -1) return;
    this.texts.splice(index, 1);
    this.textStates.splice(index, 1);
    this.app.stage.removeChild(text);
  }
  destroy() {
    this.actButton.container.destroy();
    this.app.stage.removeChild(...this.texts);
    this.texts.forEach((text) => text.destroy());
  }
}
