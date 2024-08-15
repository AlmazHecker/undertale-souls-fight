import { GAME_CONTAINER, initializePixi } from "./config/engine.ts";

import { View } from "./config/View.ts";
import "./ui/Modal/Modal.ts";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById(GAME_CONTAINER);
  if (!container) return alert("NUH-UH!");

  const { app, heart } = await initializePixi();

  const view = new View(container, app, heart);
  await view.initialize();
  view.render();
});
