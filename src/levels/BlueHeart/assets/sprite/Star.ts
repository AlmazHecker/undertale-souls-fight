import * as PIXI from "pixi.js";
import { BaseItem } from "@/utils/items/BaseItem.ts";

export class Star extends BaseItem {
  constructor(x = 0, y = 0, texture: PIXI.Texture) {
    const sprite = new PIXI.Sprite(texture);
    super(sprite, x, y);

    this.container._zIndex = 2;
    this.container.label = "star";

    this.centerWithPivot();
    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  18, 2, 19, 2, 20, 5, 21, 8, 24, 10, 24, 13, 24, 16, 27, 16, 29, 17, 32, 18,
  34, 19, 36, 21, 33, 22, 31, 24, 28, 24, 27, 26, 29, 29, 30, 32, 30, 35, 30,
  38, 28, 40, 27, 38, 25, 36, 23, 34, 21, 32, 18, 32, 16, 33, 14, 35, 12, 37,
  10, 39, 8, 39, 8, 36, 8, 33, 8, 30, 9, 28, 10, 25, 8, 24, 5, 23, 3, 21, 2, 20,
  3, 18, 6, 17, 8, 16, 11, 16, 14, 15, 14, 12, 14, 9, 16, 7, 17, 4, 18, 2,
];
