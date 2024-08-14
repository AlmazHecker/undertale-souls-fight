import * as PIXI from "pixi.js";
import { BaseItem } from "@/core/BaseItem.ts";
import { ItemOptions } from "@/utils/types.ts";

export class Glove extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, options.width, options.height);
    this.container._zIndex = 2;

    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  33, 2, 42, 6, 42, 19, 40, 32, 43, 43, 48, 32, 54, 23, 58, 11, 65, 4, 73, 9,
  70, 22, 65, 33, 62, 44, 66, 38, 73, 27, 79, 16, 88, 12, 92, 21, 87, 30, 83,
  42, 77, 53, 79, 56, 86, 45, 96, 43, 98, 54, 93, 65, 88, 75, 83, 85, 78, 96,
  76, 107, 75, 118, 63, 116, 50, 114, 38, 112, 25, 115, 14, 115, 14, 106, 22,
  98, 15, 90, 9, 80, 4, 70, 2, 57, 7, 50, 16, 55, 20, 62, 23, 49, 25, 37, 27,
  24, 28, 12, 33, 2,
];
