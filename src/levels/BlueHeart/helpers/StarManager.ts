import { Application, Assets, Container, Sprite } from "pixi.js";
import starPng from "../assets/img/star.png";
import musicPng from "../assets/img/music.png";
import { Star } from "../assets/sprite/Star.ts";
import { Heart } from "../../../utils/items/Heart.ts";
import { arePolygonsColliding } from "../../../utils/helpers/pixi.helper.ts";

export class StarManager {
  public starContainer = new Container<Sprite>();
  private starSpeed = 3;
  private starSize = 30;
  private starSpacing = 15;
  private starRotation = 0.1;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  async initialize() {
    const numStarsX =
      Math.floor(this.app.renderer.width / (this.starSize + this.starSpacing)) +
      1;
    const starTexture = await Assets.load(starPng);

    for (let i = 0; i < numStarsX; i++) {
      const x =
        this.app.renderer.width + i * (this.starSize + this.starSpacing);
      const y = this.app.renderer.height / 2 + this.starSize + 170;
      const star = new Star(x, y, starTexture);
      this.starContainer.addChild(star.container);
    }
    this.app.stage.addChild(this.starContainer);
  }

  public infiniteStarsLogic() {
    const stars = this.starContainer.children;
    const collisions: Sprite[] = [];

    stars.forEach((star, index) => {
      star.x -= this.starSpeed;
      star.rotation -= this.starRotation;
      if (star.x + this.starSize < 0) {
        const lastStarX = stars[(index - 1 + stars.length) % stars.length].x;
        star.x = lastStarX + this.starSize + this.starSpacing;
      }

      const isDamaged = arePolygonsColliding(star, this.heart.container);
      if (isDamaged) collisions.push(star);
    });

    return collisions;
  }

  public async helpUser() {
    const musicTexture = await Assets.load(musicPng);
    this.starSpeed = 0;
    this.starRotation = 0;

    for (let i = this.starContainer.children.length - 1; i >= 0; i--) {
      const star = this.starContainer.children[i];

      star.rotation = 0;
      star.texture = musicTexture;
      star.tint = "#07a108";
    }
  }

  destroy() {
    this.app.stage.children.forEach((child) => {
      if (child.label === "star") child.destroy();
    });
  }
}
