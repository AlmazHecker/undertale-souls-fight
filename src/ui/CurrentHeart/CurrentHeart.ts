import { SOULS } from "@/utils/constants.ts";
import css from "./CurrentHeart.module.css";
import tvScreenSrc from "@/assets/fight/tv-screen.png";

type CurrentSoulArgs = {
  soulIndex: number;
};

export const CurrentSoul = ({ soulIndex }: CurrentSoulArgs) => {
  const soul = SOULS[soulIndex];

  const imageWrapper = document.createElement("div");
  imageWrapper.className = css["image-wrapper"];

  const tvScreen = document.createElement("img");
  tvScreen.className = css["tv-screen"];
  tvScreen.src = tvScreenSrc;
  tvScreen.alt = "tv-screen";

  let heartSvg = document.createElement("svg");
  heartSvg.innerHTML = `
<svg class="${css["current-soul"]}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
    <path d="M24 8L24 6 22 6 22 4 20 4 20 6 18 6 18 8 17 8 16 8 16 10 14 10 14 8 13 8 12 8 12 6 10 6 10 4 8 4 8 6 6 6 6 8 4 8 4 10 4 18 6 18 6 20 8 20 8 22 10 22 10 24 12 24 12 26 15 26 18 26 18 24 20 24 20 22 22 22 22 20 24 20 24 18 26 18 26 10 26 8z"
          fill="${soul.color}"/>
</svg>
  `;

  heartSvg = heartSvg.firstElementChild as HTMLElement;
  imageWrapper.appendChild(tvScreen);
  imageWrapper.appendChild(heartSvg);

  return imageWrapper;
};
