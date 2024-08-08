import "./style.css";
import { GAME_CONTAINER, initializePixi } from "./config/engine.ts";

import { View } from "./config/View.ts";
import "./ui/Modal/Modal.ts";
import determinationPath from "@/assets/fonts/determination-extended.ttf";

const DeterminationFont = new FontFace(
  "Determination",
  `url(${determinationPath})`,
);

document.addEventListener("DOMContentLoaded", async () => {
  await DeterminationFont.load();
  const container = document.getElementById(GAME_CONTAINER);
  if (!container) return alert("NUH-UH!");

  const { app, heart } = await initializePixi({});
  return new View(container, app, heart).initialize();
});
