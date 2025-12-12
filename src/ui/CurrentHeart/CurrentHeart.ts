import { SOULS } from "@/utils/constants.ts";
import css from "./CurrentHeart.module.css";
import tvScreenSrc from "@/ui/CurrentHeart/tv-screen.png";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";

type CurrentSoulArgs = {
  soulIndex: number;
};

export const CurrentSoul = ({ soulIndex }: CurrentSoulArgs) => {
  const soul = SOULS[soulIndex];

  const imageWrapper = createElementWithClass("div", css["image-wrapper"]);
  const tvScreen = createElementWithClass<"img">("img", css["tv-screen"]);
  tvScreen.src = tvScreenSrc;
  tvScreen.alt = "tv-screen";

  let heartSvg = document.createElement("svg");
  heartSvg.innerHTML = `
    <svg class="${css["current-soul"]}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
  <path d="M24 8V6h-2V4h-2v2h-2v2h-2v2h-2V8h-2V6h-2V4H8v2H6v2H4v10h2v2h2v2h2v2h2v2h6v-2h2v-2h2v-2h2v-2h2V8z" fill="${soul.color}"/>
</svg>`;

  imageWrapper.append(tvScreen, heartSvg.firstElementChild as HTMLElement);

  return imageWrapper;
};
