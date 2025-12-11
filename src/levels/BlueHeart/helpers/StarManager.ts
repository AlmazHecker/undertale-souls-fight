import { Application, Assets, Container, Sprite, Texture } from "pixi.js";
import { Star } from "../assets/sprite/Star.ts";
import { Heart } from "@/utils/items/Heart.ts";
import { arePolygonsColliding } from "@/utils/helpers/pixi.helper.ts";
import { vibrate } from "@/utils/helpers/timing.helper.ts";
import { GLOBAL_SCALE, HEIGHT, WIDTH } from "@/config/engine.ts";

export class StarManager {
  public starContainer = new Container<Sprite>();
  private starSpeed = 3 * GLOBAL_SCALE;
  private starSize = 30 * GLOBAL_SCALE;
  private starSpacing = 15 * GLOBAL_SCALE;
  private starRotation = 0.1;
  private musicTexture!: Texture;

  public isHelping = false;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart
  ) {}

  async initialize() {
    const numStarsX =
      Math.floor(WIDTH / (this.starSize + this.starSpacing)) + 1;
    const assets = await Assets.loadBundle("blue");
    this.musicTexture = assets.music;

    for (let i = 0; i < numStarsX; i++) {
      const x = WIDTH + i * (this.starSize + this.starSpacing);
      const y = HEIGHT - Star.height * (1.2 * GLOBAL_SCALE);
      const star = new Star(x, y, assets.star);
      star.centerWithPivot();
      star.container.scale.set(GLOBAL_SCALE);

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
    this.starSpeed = 0;
    this.starRotation = 0;
    this.isHelping = true;

    for (let i = this.starContainer.children.length - 1; i >= 0; i--) {
      const star = this.starContainer.children[i];

      star.rotation = 0;
      star.texture = this.musicTexture!;
      star.tint = "#07a108";
      vibrate({
        container: star,
        duration: 20000,
        y: star.y,
        x: star.x,
        intensity: 0.5,
      });
    }
  }

  destroy() {
    this.app.stage.removeChild(this.starContainer);
  }
}
