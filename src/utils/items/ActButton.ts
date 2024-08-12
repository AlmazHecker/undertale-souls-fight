import { Assets, Sprite, Texture } from "pixi.js";

import { BaseItem } from "./BaseItem.ts";
import { Heart } from "./Heart.ts";
import { animateWithTimer } from "../helpers/timing.helper.ts";
import { arePolygonsColliding } from "../helpers/pixi.helper.ts";
import actPng from "@/assets/fight/act.png";

export class ActButton extends BaseItem {
  constructor(texture?: Texture) {
    const actButtonSprite = new Sprite(texture);
    super(actButtonSprite, 0, 0, 140, 50);

    this.container.tint = "#dc8a51";
    this.container.visible = false;
    this.centerWithPivot();
    this.container._zIndex = 5;
    this.container.hitArea = this.toPolygon(svgPolygon);
    this.container.label = "act-button";
  }

  public async initialize() {
    const actButtonTexture = await Assets.load(actPng);
    this.container.texture = actButtonTexture;
  }

  public isCollidingWithHeart(heart: Heart) {
    const isColliding = arePolygonsColliding(heart.container, this.container);
    this.container.tint = isColliding ? "#ffff00" : "#dc8a51";

    return isColliding;
  }

  public async disappear() {
    await animateWithTimer(1000, (progress) => {
      this.container.alpha = 1 - progress;
    });
    this.container.visible = false;
  }
}

const svgPolygon = [0, 0, 0, 40, 110, 40, 110, 0];
