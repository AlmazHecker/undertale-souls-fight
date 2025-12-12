import * as PIXI from "pixi.js";
import { ItemOptions } from "@/utils/types.ts";
import { BaseItem } from "@/core/BaseItem.ts";

export class Pistol extends BaseItem {
  public static width: number = 101;
  public static height: number = 91;

  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    console.log(options.texture);

    super(sprite, options.x, options.y);
    this.container._zIndex = 2;
  }
}
