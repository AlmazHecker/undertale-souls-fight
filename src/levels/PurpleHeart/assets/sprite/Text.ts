import * as PIXI from "pixi.js";
import { TextStyle } from "pixi.js";

const textStyle = new TextStyle({
  fontFamily: "Determination",
  fontWeight: "700",
  fill: "white",
  lineHeight: 0,
});

export class Text {
  public text: PIXI.Text;

  constructor(text: string, x = 0, y = 0) {
    this.text = new PIXI.Text({ text, x, y, style: textStyle });
    this.text.zIndex = 2;
  }
}
