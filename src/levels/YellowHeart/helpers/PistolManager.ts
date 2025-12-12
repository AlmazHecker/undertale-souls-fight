import { Heart } from "@/utils/items/Heart.tsx";
import { Application, Assets, Sprite, Texture } from "pixi.js";

import {
  arePolygonsColliding,
  isOutOfCanvas,
} from "@/utils/helpers/pixi.helper.ts";
import { vibrate } from "@/utils/helpers/timing.helper.ts";
import { Pistol } from "@/levels/YellowHeart/assets/sprite/Pistol.ts";
import { PistolAim } from "@/levels/YellowHeart/assets/sprite/PistolAim.ts";
import { Bullet } from "@/levels/YellowHeart/assets/sprite/Bullet.ts";
import { ActButton } from "@/utils/items/ActButton.ts";
import { GLOBAL_SCALE, HEIGHT, WIDTH } from "@/config/engine";

type BulletData = { bullet: Bullet | ActButton; aim: PistolAim; angle: number };

export class PistolManager {
  public actButton = new ActButton();

  private status: "IDLE" | "HELPING" | "DESTROY" = "IDLE";
  private pistol!: Pistol;
  private aimTexture!: Texture;
  private bulletTexture!: Texture;
  private heartAimTexture!: Texture;
  private flowerTexture!: Texture;
  private bulletCount = 0;
  private activeBullets: BulletData[] = [];
  private cycleTime = 0;
  private cycleStage = 0;
  private pistolAims: PistolAim[] = [];
  private bulletSpeed = 13 * GLOBAL_SCALE;
  private stepDuration = 12;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart
  ) {}

  async initialize() {
    await this.actButton.initialize();

    const assets = await Assets.loadBundle("yellow");
    this.aimTexture = assets.pistolAim;
    this.bulletTexture = assets.bullet;
    this.heartAimTexture = assets.heartAim;
    this.flowerTexture = assets.flower;
    const pistolTexture = assets.pistol;

    this.pistol = new Pistol({ texture: pistolTexture });
    this.pistol.container.x = WIDTH / 2;
    this.pistol.container.y = HEIGHT / 2;
    this.pistol.centerWithPivot();
    this.pistol.container.scale.set(GLOBAL_SCALE * 1.5);

    this.app.stage.addChild(this.pistol.container);
  }

  public pistolAnimation(delta: number) {
    // if (this.cycleStage === 0 && this.activeBullets.length > 0) return;

    this.cycleTime += delta;

    if (this.cycleTime < this.stepDuration) return;

    this.cycleTime = 0;

    if (this.cycleStage >= 0 && this.cycleStage <= 2) {
      const positions = ["after", "before", "center"];
      const position = positions[this.cycleStage];

      const aim = this.drawAim(position);
      this.pistolAims.push(aim);
    } else if (this.cycleStage >= 3 && this.cycleStage <= 5) {
      const index = this.cycleStage - 3;
      const aim = this.pistolAims[index];

      this.fireBullet(aim);
    }

    this.cycleStage++;

    if (this.cycleStage > 5) {
      this.cycleStage = 0;
      this.pistolAims = [];
    }
  }

  private drawAim(position: string) {
    const radius = 240 * GLOBAL_SCALE;
    const pistolAim = this.createPistolAim();

    const pistolX = this.pistol.container.x;
    const pistolY = this.pistol.container.y;

    const heartX = this.heart.container.x;
    const heartY = this.heart.container.y;

    let aimX = heartX;
    let aimY = heartY;

    if (position === "after") {
      aimX = heartX + radius;
    }
    if (position === "before") {
      aimX = heartX - radius;
    }
    if (this.status === "HELPING") {
      aimX = heartX;
      aimY = heartY;
    }

    // Clamp within radius of pistol
    const dx = aimX - pistolX;
    const dy = aimY - pistolY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius) {
      const s = radius / dist;
      aimX = pistolX + dx * s;
      aimY = pistolY + dy * s;
    }

    pistolAim.container.x = aimX;
    pistolAim.container.y = aimY;

    this.app.stage.addChild(pistolAim.container);
    return pistolAim;
  }

  private fireBullet(aim: PistolAim) {
    this.bulletCount++;

    const bullet = this.createBullet(
      this.pistol.container.x,
      this.pistol.container.y
    );

    const bx = bullet.container.x;
    const by = bullet.container.y;

    const ax = aim.container.x;
    const ay = aim.container.y;

    const angle = Math.atan2(ay - by, ax - bx);

    bullet.container.rotation = angle;
    this.pistol.container.rotation = angle;

    this.app.stage.addChild(bullet.container);

    this.activeBullets.push({ bullet, aim, angle });
  }

  private updateBullets() {
    for (let i = this.activeBullets.length - 1; i >= 0; i--) {
      const b = this.activeBullets[i];

      b.bullet.container.x += Math.cos(b.angle) * this.bulletSpeed;
      b.bullet.container.y += Math.sin(b.angle) * this.bulletSpeed;

      if (isOutOfCanvas(b.bullet.container, this.app)) {
        b.aim.container.destroy();

        if (b.bullet.container.label !== "act-button") {
          b.bullet.container.destroy();
        }

        this.activeBullets.splice(i, 1);
      }
    }
  }

  private createPistolAim() {
    let texture = this.aimTexture;
    let size = 60 * GLOBAL_SCALE;
    if (this.status === "HELPING") {
      texture = this.heartAimTexture;
      size = 45 * GLOBAL_SCALE;
    }
    const aim = new PistolAim({ texture });
    aim.centerWithPivot();
    aim.container.width = size;
    aim.container.height = size;
    return aim;
  }

  private createBullet(x: number, y: number) {
    if (this.bulletCount === 40) {
      this.actButton.container.visible = true;
      this.actButton.container.position.set(x, y);
      this.app.stage.addChild(this.actButton.container);
      return this.actButton;
    }

    const bullet = new Bullet({ texture: this.bulletTexture, x, y });
    bullet.container.width *= GLOBAL_SCALE;
    bullet.container.height *= GLOBAL_SCALE;

    if (this.status === "HELPING") {
      bullet.container.texture = this.flowerTexture;
      bullet.container.tint = "#07a108";
      bullet.container.width = 100 * GLOBAL_SCALE;
      bullet.container.height = 40.82 * GLOBAL_SCALE;
    }

    return bullet;
  }

  public checkCollisions(delta: number) {
    this.pistolAnimation(delta);
    this.updateBullets();

    const collisions: Sprite[] = [];

    this.app.stage.children.forEach((sprite) => {
      if (sprite.label === "bullet") {
        const isColliding = arePolygonsColliding(sprite, this.heart.container);
        if (isColliding) collisions.push(sprite as Sprite);
      }
    });
    return collisions;
  }

  public preparingHelp() {
    return vibrate({
      container: this.pistol.container,
      duration: 3000,
      x: this.pistol.container.x,
      y: this.pistol.container.y,
    });
  }

  public async helpUser() {
    this.status = "HELPING";
    this.pistol.container.tint = "#07a108";
  }

  public destroy() {
    this.status = "DESTROY";

    this.activeBullets.forEach(({ bullet, aim }) => {
      if (bullet.container.label !== "act-button") {
        bullet.container.destroy();
      }
      aim.container.destroy();
    });
    this.activeBullets = [];

    this.pistol.container.destroy();
    this.app.stage.removeChild(this.pistol.container);
  }
}
