import { GAME_CONTAINER, initializePixi } from "./config/engine.ts";

import { View } from "./config/View.ts";
import "./ui/Modal/Modal.ts";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById(GAME_CONTAINER);
  if (!container) return alert("NUH-UH!");

  const { app, heart } = await initializePixi({});

  const btn = document.createElement("button");
  btn.addEventListener("click", () => {
    btn.remove();
    return new View(container, app, heart).initialize();
  });
  btn.innerText = "content";
  document.body.append(btn);
});
