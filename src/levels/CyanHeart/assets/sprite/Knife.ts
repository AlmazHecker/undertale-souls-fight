import * as PIXI from "pixi.js";
import { BaseItem } from "@/core/BaseItem.ts";

export class Knife extends BaseItem {
  constructor(texture: PIXI.Texture, x: number, y: number) {
    const sprite = new PIXI.Sprite(texture);
    super(sprite, x, y, 128, 36);
    this.container._zIndex = 1;

    this.centerWithPivot();

    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  95, 11, 99, 16, 103, 20, 107, 24, 105, 28, 99, 28, 95, 25, 95, 19, 95, 13, 37,
  0, 39, 4, 39, 11, 45, 11, 51, 11, 58, 11, 64, 11, 70, 11, 77, 11, 83, 11, 90,
  11, 95, 12, 95, 18, 95, 25, 92, 28, 86, 28, 79, 28, 73, 28, 66, 28, 60, 28,
  54, 28, 47, 28, 41, 28, 39, 33, 35, 35, 32, 32, 30, 27, 24, 27, 18, 27, 11,
  27, 5, 27, 0, 25, 0, 19, 1, 14, 8, 14, 14, 14, 20, 14, 27, 14, 32, 13, 32, 6,
  32, 0,
];
