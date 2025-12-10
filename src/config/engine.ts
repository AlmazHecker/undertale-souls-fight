import { Heart } from "../utils/items/Heart";
import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { PIXI_ASSETS_MANIFEST } from "@/utils/constants.ts";

export const GAME_CONTAINER = "game-container";

export const WIDTH = window.innerWidth;
export const HEIGHT = window.innerHeight;

export const GLOBAL_SCALE = Math.min(WIDTH / 800, HEIGHT / 600);

export const initializePixi = async () => {
  let app: PIXI.Application | undefined = new PIXI.Application();

  let heart: Heart | undefined = undefined;

  await app.init({
    resizeTo: window,
    width: WIDTH,
    height: HEIGHT,
  });

  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";

  if (import.meta.env.MODE === "development") {
    const winda = window as unknown as Record<string, unknown>;
    winda.__PIXI_APP__ = app;
    winda.__PIXI_STAGE__ = app.stage;
    winda.__PIXI_RENDERER__ = app.renderer;
  }
  app.ticker.minFPS = 60;
  app.ticker.maxFPS = 60;

  heart = new Heart();
  heart.setup();
  app.stage.addChild(heart.container);

  const destroy = () => {
    app?.destroy(true, {
      children: true,
      texture: true,
      textureSource: true,
    });
    heart?.destroy();
    heart = undefined;
    app = undefined;
  };

  await Assets.init({ manifest: PIXI_ASSETS_MANIFEST });
  Assets.backgroundLoadBundle([
    "blue",
    "orange",
    "cyan",
    "purple",
    "green",
    "yellow",
  ]);

  return { app, heart, destroy };
};
