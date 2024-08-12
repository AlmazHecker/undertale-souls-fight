import * as PIXI from "pixi.js";
import { BaseItem } from "@/utils/items/BaseItem.tsx";
import { ItemOptions } from "@/utils/types.ts";

export class Flower extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, options.width, options.height);
    this.container._zIndex = 1;
    this.centerWithPivot();
    this.container.label = "bullet";
    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  35, 3, 33, 8, 27, 7, 27, 2, 32, 1, 39, 2, 44, 3, 44, 8, 43, 3, 37, 2, 36, 5,
  34, 9, 32, 11, 27, 13, 23, 12, 24, 11, 24, 10, 22, 9, 27, 7, 33, 8, 34, 3, 42,
  3, 44, 8, 39, 9, 36, 6, 23, 9, 25, 11, 19, 11, 14, 11, 8, 12, 2, 13, 0, 10, 5,
  8, 11, 7, 17, 7, 38, 9, 43, 11, 38, 12, 35, 17, 34, 12, 37, 9, 34, 17, 29, 18,
  27, 14, 31, 11, 44, 14, 41, 18, 36, 18,
];
