import * as PIXI from "pixi.js";
import { ItemOptions } from "@/utils/types.ts";
import { BaseItem } from "@/core/BaseItem.ts";

export class Pan extends BaseItem {
  public static readonly width = 190;
  public static readonly height = 30;

  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, Pan.width, Pan.height);

    // 161w, 25h
    this.container._zIndex = 2;
  }
}
