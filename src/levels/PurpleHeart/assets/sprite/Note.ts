import * as PIXI from "pixi.js";
import { BaseItem } from "@/core/BaseItem.ts";
import { GLOBAL_SCALE } from "@/config/engine";

export class Note extends BaseItem {
  public static width = 200;
  public static height = 238;

  constructor(texture: PIXI.Texture, x: number, y: number) {
    const sprite = new PIXI.Sprite(texture);
    super(sprite, x, y, Note.width, Note.height);
    this.container.label = "note";

    const scaleX = (Note.width / texture.width) * GLOBAL_SCALE;
    const scaleY = (Note.height / texture.height) * GLOBAL_SCALE;
    this.container.scale.set(scaleX, scaleY);

    this.container._zIndex = 3;
  }
}
