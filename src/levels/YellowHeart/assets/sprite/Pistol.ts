import * as PIXI from "pixi.js";
import { ItemOptions } from "@/utils/types.ts";
import { BaseItem } from "@/core/BaseItem.ts";

export class Pistol extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, options.width, options.height);
    this.container._zIndex = 2;
    this.centerWithPivot();
  }
}
