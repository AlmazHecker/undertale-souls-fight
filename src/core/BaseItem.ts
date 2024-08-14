import { Graphics, Polygon, Sprite } from "pixi.js";

export class BaseItem<T extends Sprite | Graphics = Sprite> {
  constructor(
    public container: T,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (x) this.container.x = x;
    if (y) this.container.y = y;
    if (width) {
      this.container.width = width || this.container.width;
    }
    if (height) {
      this.container.height = height || this.container.height;
    }
  }

  public toPolygon(path: number[]) {
    return new Polygon(path);
  }

  public centerWithPivot() {
    const centerX = this.container.width / 2;
    const centerY = this.container.height / 2;
    this.container.pivot.set(centerX, centerY);
  }
}
