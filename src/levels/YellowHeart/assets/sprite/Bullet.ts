import * as PIXI from "pixi.js";
import { BaseItem } from "@/utils/items/BaseItem.ts";
import { ItemOptions } from "@/utils/types.ts";

export class Bullet extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, 60, 29.3);
    this.container._zIndex = 1;
    this.centerWithPivot();
    this.container.label = "bullet";
    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  4, 0, 8, 0, 10, 1, 13, 0, 17, 0, 21, 0, 25, 0, 23, 1, 18, 1, 14, 1, 12, 2, 12,
  6, 12, 10, 12, 14, 12, 19, 16, 19, 20, 19, 24, 19, 23, 19, 19, 19, 15, 19, 11,
  18, 7, 19, 4, 19, 4, 15, 4, 11, 4, 7, 4, 2, 27, 0, 31, 1, 35, 2, 39, 4, 42, 6,
  43, 10, 41, 14, 37, 16, 33, 18, 29, 19, 25, 19,
];
