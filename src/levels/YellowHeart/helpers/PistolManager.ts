import { Heart } from "@/utils/items/Heart.tsx";
import { Application, Assets, Sprite, Texture } from "pixi.js";
import pistolPng from "@/levels/YellowHeart/assets/img/pistol.png";
import bulletPng from "@/levels/YellowHeart/assets/img/bullet.png";

import pistolAimPng from "@/levels/YellowHeart/assets/img/pistol-aim.png";
import actButtonPng from "@/assets/fight/act.png";
import heartAimPng from "@/levels/YellowHeart/assets/img/heart-aim.png";
import flowerPng from "@/levels/YellowHeart/assets/img/flower.png";

import {
  arePolygonsColliding,
  createTicker,
  isOutOfCanvas,
} from "@/utils/helpers/pixi.helper.ts";
import {
  callInfinitely,
  sleep,
  vibrate,
} from "@/utils/helpers/timing.helper.ts";
import { Pistol } from "@/levels/YellowHeart/assets/sprite/Pistol.ts";
import { PistolAim } from "@/levels/YellowHeart/assets/sprite/PistolAim.ts";
import { Bullet } from "@/levels/YellowHeart/assets/sprite/Bullet.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class PistolManager {
  public actButton!: ActButton;

  private pistol!: Pistol;
  private aimTexture!: Texture;
  private bulletTexture!: Texture;
  private actButtonTexture!: Texture;
  private heartAimTexture!: Texture;
  private flowerTexture!: Texture;
  private bulletCount = 0;
  private isHelping = false;
  private aimSleep = 250;
  private bulletSleep = 100;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  async initialize() {
    const appCenterX = this.app.renderer.width / 2;
    const appCenterY = this.app.renderer.height / 2;

    this.aimTexture = await Assets.load(pistolAimPng);
    this.bulletTexture = await Assets.load(bulletPng);
    this.actButtonTexture = await Assets.load(actButtonPng);
    this.heartAimTexture = await Assets.load(heartAimPng);
    this.flowerTexture = await Assets.load(flowerPng);
    const pistolTexture = await Assets.load(pistolPng);

    this.pistol = new Pistol({ texture: pistolTexture });
    this.pistol.container.width = 160;
    this.pistol.container.height = 144.16;
    this.pistol.container.x = appCenterX;
    this.pistol.container.y = appCenterY;

    this.app.stage.addChild(this.pistol.container);

    callInfinitely(this.pistolAnimation.bind(this), true);
  }

  public async pistolAnimation() {
    const positions = ["after", "before", "center"];
    const pistolAims = [];

    for (const position of positions) {
      pistolAims.push(await this.drawAim(position));
    }
    for (let i = 0; i < 3; i++) {
      await this.fireBullet(pistolAims[i]);
    }
  }

  private async drawAim(position: string) {
    const radius = 240;

    const pistolAim = this.createPistolAim();

    const pistolX = this.pistol.container.x;
    const pistolY = this.pistol.container.y;

    const heartX = this.heart.container.x;
    const heartY = this.heart.container.y;

    let aimX = 0,
      aimY = 0;

    if (this.isHelping) {
      const dx = heartX - pistolX;
      const dy = heartY - pistolY;
      const angle = Math.atan2(dy, dx);

      const aimX = pistolX + radius * Math.cos(angle);
      const aimY = pistolY + radius * Math.sin(angle);
      // ЕСЛИ ЧЕЛ ПОПРОСИЛ О ПОМОЩИ, ТО СЛЕД ВЫСТРЕЛЫ
      // БУДУТ ТОЛЬКО В ЕГО ПОЗИЦИЮ(хилка)
      pistolAim.container.x = aimX;
      pistolAim.container.y = aimY;

      this.app.stage.addChild(pistolAim.container);
      await sleep(this.aimSleep);
      return pistolAim;
    }

    switch (position) {
      case "center":
        aimX = heartX;
        aimY = heartY;
        break;
      case "after":
        aimX = heartX + radius * Math.cos(0); // Angle 0 (top)
        aimY = heartY + radius * Math.sin(0); // Angle 0 (top)
        break;
      case "before":
        aimX = heartX + radius * Math.cos(Math.PI); // Angle π (bottom)
        aimY = heartY + radius * Math.sin(Math.PI); // Angle π (bottom)
        break;
    }

    // START: СТАВИМ АИМ ТЕКСТУРУ В ОКРУЖНОСТЬ КРУГА
    const dx = aimX - pistolX;
    const dy = aimY - pistolY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) {
      const scale = radius / distance;
      aimX = pistolX + dx * scale;
      aimY = pistolY + dy * scale;
    }
    // END: СТАВИМ АИМ ТЕКСТУРУ В ОКРУЖНОСТЬ КРУГА

    pistolAim.container.x = aimX;
    pistolAim.container.y = aimY;

    this.app.stage.addChild(pistolAim.container);
    await sleep(this.aimSleep);
    return pistolAim;
  }

  private async fireBullet(pistolAim: PistolAim) {
    this.bulletCount++;
    await sleep(this.bulletSleep);
    const bullet = this.createBullet(
      this.pistol.container.x,
      this.pistol.container.y,
    );
    this.setBulletTrajectory(bullet, pistolAim);

    this.app.stage.addChild(bullet.container);
    return bullet;
  }

  private setBulletTrajectory(bullet: Bullet, pistolAim: PistolAim) {
    const { x: bulletX, y: bulletY } = bullet.container;
    const { x: aimX, y: aimY } = pistolAim.container;
    const angle = Math.atan2(aimY - bulletY, aimX - bulletX);

    this.pistol.container.rotation = angle;
    bullet.container.rotation = angle;

    const speed = 10;
    const ticker = createTicker();

    ticker.add(() => {
      bullet.container.x += Math.cos(angle) * speed;
      bullet.container.y += Math.sin(angle) * speed;

      if (isOutOfCanvas(bullet.container, this.app)) {
        if (bullet.container.label !== "act-button") {
          bullet.container.destroy();
        }
        pistolAim.container.destroy();
        ticker.stop();
      }
    });

    ticker.start();
  }

  private createPistolAim() {
    const texture = this.isHelping ? this.heartAimTexture : this.aimTexture;
    const size = this.isHelping ? 45 : 60;
    return new PistolAim({ texture, width: size, height: size });
  }

  private createBullet(x: number, y: number) {
    if (this.bulletCount === 40) {
      return this.createActButton(x, y);
    }

    const texture = this.isHelping ? this.flowerTexture : this.bulletTexture;
    const bullet = new Bullet({ texture, x, y });
    if (this.isHelping) {
      bullet.container.tint = "#07a108";
      bullet.container.width = 100;
      bullet.container.height = 40.82;
    }

    return bullet;
  }

  public checkCollisions() {
    const collisions: Sprite[] = [];

    this.app.stage.children.forEach((sprite) => {
      if (sprite.label === "bullet") {
        const isColliding = arePolygonsColliding(sprite, this.heart.container);
        if (isColliding) collisions.push(sprite as Sprite);
      }
    });
    return collisions;
  }

  private createActButton(x: number, y: number) {
    this.actButton = new ActButton(this.actButtonTexture);
    this.actButton.container.zIndex = 5;
    this.actButton.container.visible = true;
    this.actButton.container.x = x;
    this.actButton.container.y = y;
    this.app.stage.addChild(this.actButton.container);
    return this.actButton;
  }

  public async helpUser() {
    await vibrate(
      this.pistol.container,
      3000,
      this.pistol.container.y,
      this.pistol.container.x,
    );
    this.isHelping = true;
  }

  public destroy() {
    this.pistol.container.destroy();
    this.app.stage.removeChild(this.pistol.container);
  }
}
