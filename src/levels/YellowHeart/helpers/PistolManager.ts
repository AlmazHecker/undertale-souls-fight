import { Heart } from "@/utils/items/Heart.tsx";
import { Application, Assets, Sprite, Texture } from "pixi.js";
import pistolPng from "@/levels/YellowHeart/assets/img/pistol.png";
import bulletPng from "@/levels/YellowHeart/assets/img/bullet.png";

import pistolAimPng from "@/levels/YellowHeart/assets/img/pistol-aim.png";
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
  VibrateOptions,
} from "@/utils/helpers/timing.helper.ts";
import { Pistol } from "@/levels/YellowHeart/assets/sprite/Pistol.ts";
import { PistolAim } from "@/levels/YellowHeart/assets/sprite/PistolAim.ts";
import { Bullet } from "@/levels/YellowHeart/assets/sprite/Bullet.ts";
import { ActButton } from "@/utils/items/ActButton.ts";

export class PistolManager {
  public actButton = new ActButton();

  private status: "IDLE" | "HELPING" | "DESTROY" = "IDLE";
  private pistol!: Pistol;
  private aimTexture!: Texture;
  private bulletTexture!: Texture;
  private heartAimTexture!: Texture;
  private flowerTexture!: Texture;
  private bulletCount = 0;
  private aimSleep = 250;
  private bulletSleep = 100;

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  async initialize() {
    await this.actButton.initialize();
    const appCenterX = this.app.renderer.width / 2;
    const appCenterY = this.app.renderer.height / 2;

    this.aimTexture = await Assets.load(pistolAimPng);
    this.bulletTexture = await Assets.load(bulletPng);
    this.heartAimTexture = await Assets.load(heartAimPng);
    this.flowerTexture = await Assets.load(flowerPng);
    const pistolTexture = await Assets.load(pistolPng);

    this.pistol = new Pistol({ texture: pistolTexture });
    this.pistol.container.width = 160;
    this.pistol.container.height = 144.16;
    this.pistol.container.x = appCenterX;
    this.pistol.container.y = appCenterY;

    this.app.stage.addChild(this.pistol.container);

    callInfinitely(this.pistolAnimation.bind(this), this.status !== "DESTROY");
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

    if (this.status === "HELPING") {
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
    let texture = this.aimTexture;
    let size = 60;
    if (this.status === "HELPING") {
      texture = this.heartAimTexture;
      size = 45;
    }
    return new PistolAim({ texture, width: size, height: size });
  }

  private createBullet(x: number, y: number) {
    if (this.bulletCount === 40) {
      this.actButton.container.visible = true;
      this.actButton.container.position.set(x, y);
      this.app.stage.addChild(this.actButton.container);
      return this.actButton;
    }

    const bullet = new Bullet({ texture: this.bulletTexture, x, y });
    if (this.status === "HELPING") {
      bullet.container.texture = this.flowerTexture;
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

  public preparingHelp() {
    const options: VibrateOptions = {
      container: this.pistol.container,
      duration: 3000,
      x: this.pistol.container.x,
      y: this.pistol.container.y,
    };
    return vibrate(options);
  }

  public async helpUser() {
    this.status = "HELPING";
    this.pistol.container.tint = "#07a108";
  }

  public destroy() {
    this.status = "DESTROY";
    this.pistol.container.destroy();
    this.app.stage.removeChild(this.pistol.container);
  }
}
