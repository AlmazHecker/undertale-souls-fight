import { Heart } from "../utils/items/Heart";
import * as PIXI from "pixi.js";

export const GAME_CONTAINER = "game-container";

export const initializePixi = async () => {
  let app: PIXI.Application | undefined = new PIXI.Application();
  let heart: Heart | undefined = undefined;

  const container = document.getElementById(GAME_CONTAINER) || undefined;

  await app.init({ width: 800, height: 500, resizeTo: container });

  if (import.meta.env.MODE === "development") {
    const winda = window as unknown as Record<string, unknown>;
    winda.__PIXI_APP__ = app;
    winda.__PIXI_STAGE__ = app.stage;
    winda.__PIXI_RENDERER__ = app.renderer;
  }
  app.ticker.minFPS = 60;
  app.ticker.maxFPS = 60;

  heart = new Heart(app);
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

  return { app, heart, destroy };
};
