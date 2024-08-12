import * as PIXI from "pixi.js";
import { BaseItem } from "@/utils/items/BaseItem.ts";

export class Shoe extends BaseItem {
  constructor(x = 0, y = 0, texture: PIXI.Texture) {
    const sprite = new PIXI.Sprite(texture);
    super(sprite, x, y, 70, 150);
    this.container.label = "shoe";
    this.container._zIndex = 2;

    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  18.5, -0.5, 27.5, -0.5, 35.5, 8.5, 35.5, 27.5, 29, 42.5, 21, 72.5, 10.5, 81.5,
  3.5, 81.5, -0.5, 72.5, -0.5, 36.5, 3, 15.5, 18.5, -0.5,
];
