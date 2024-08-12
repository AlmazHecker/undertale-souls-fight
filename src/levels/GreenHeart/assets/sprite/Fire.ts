import * as PIXI from "pixi.js";
import { ItemOptions } from "@/utils/types.ts";
import { BaseItem } from "@/utils/items/BaseItem.ts";

export class Fire extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, 50, 93);
    this.container._zIndex = 2;
    this.centerWithPivot();
    this.container.label = "fire";

    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  14, 4, 15, 5, 15, 7, 16, 9, 16, 10, 16, 12, 17, 14, 17, 16, 18, 18, 18, 20,
  19, 22, 20, 24, 20, 26, 21, 28, 22, 29, 22, 31, 22, 33, 22, 35, 21, 37, 20,
  39, 19, 40, 18, 42, 16, 42, 14, 43, 12, 43, 10, 43, 8, 43, 6, 42, 5, 41, 3,
  39, 2, 38, 1, 36, 1, 34, 1, 32, 1, 30, 1, 28, 2, 26, 3, 25, 4, 23, 5, 21, 6,
  20, 7, 18, 8, 16, 9, 14, 9, 13, 10, 11, 11, 9, 12, 7, 13, 5, 14, 4,
];
