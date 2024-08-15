import { GAME_CONTAINER, initializePixi } from "./config/engine.ts";

import { View } from "./config/View.ts";
import "./ui/Modal/Modal.ts";
import { preloadMp3, preloadSharedSounds } from "@/config/preload.ts";
import { Loader } from "@/ui/Loader/Loader.ts";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById(GAME_CONTAINER);
  if (!container) return alert("NUH-UH!");

  container.append(Loader());

  const [sounds, pixi] = await Promise.all([
    preloadMp3(),
    initializePixi(),
    preloadSharedSounds(),
  ]);
  container.innerHTML = "";

  const view = new View(container, pixi.app, pixi.heart, sounds);
  await view.initialize();
  view.render();
});
