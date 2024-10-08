import * as PIXI from "pixi.js";
import { BaseItem } from "@/core/BaseItem.ts";

export class Note extends BaseItem {
  constructor(texture: PIXI.Texture, x: number, y: number) {
    const sprite = new PIXI.Sprite(texture);
    super(sprite, x, y, 200, 238);
    this.container.label = "note";
    this.container._zIndex = 3;
  }
}
