import * as PIXI from "pixi.js";
import { BaseItem } from "@/core/BaseItem.ts";
import { ItemOptions } from "@/utils/types.ts";

export class Glove extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, options.width, options.height);
    this.container._zIndex = 2;

    this.container.hitArea = this.toPolygon(GLOVE_POLYGON);
  }
}

const GLOVE_POLYGON = [
  33, 2, 42, 6, 42, 19, 40, 32, 43, 43, 48, 32, 54, 23, 58, 11, 65, 4, 73, 9,
  70, 22, 65, 33, 62, 44, 66, 38, 73, 27, 79, 16, 88, 12, 92, 21, 87, 30, 83,
  42, 77, 53, 79, 56, 86, 45, 96, 43, 98, 54, 93, 65, 88, 75, 83, 85, 78, 96,
  76, 107, 75, 118, 63, 116, 50, 114, 38, 112, 25, 115, 14, 115, 14, 106, 22,
  98, 15, 90, 9, 80, 4, 70, 2, 57, 7, 50, 16, 55, 20, 62, 23, 49, 25, 37, 27,
  24, 28, 12, 33, 2,
];

export const LIKE_POLYGON = [
  44, 2, 52, 2, 54, 9, 56, 8, 61, 4, 68, 5, 71, 12, 73, 9, 80, 8, 84, 12, 85,
  20, 89, 17, 95, 19, 97, 26, 97, 34, 97, 43, 96, 51, 95, 59, 92, 66, 89, 71,
  91, 77, 92, 84, 85, 88, 78, 85, 70, 83, 64, 82, 56, 81, 48, 81, 42, 82, 36,
  86, 29, 84, 27, 77, 31, 72, 36, 67, 32, 60, 27, 56, 23, 50, 18, 44, 13, 40, 7,
  35, 6, 28, 7, 21, 15, 21, 21, 25, 27, 29, 34, 29, 37, 21, 38, 15, 40, 8, 44,
  2,
];
