import * as PIXI from "pixi.js";
import { BaseItem } from "@/utils/items/BaseItem.ts";
import { ItemOptions } from "@/utils/types.ts";

export class PistolAim extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, options.width, options.height);
    this.container._zIndex = 2;
    this.centerWithPivot();
  }
}
