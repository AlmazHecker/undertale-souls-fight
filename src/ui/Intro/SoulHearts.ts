import css from "./SoulHearts.module.css";
import { SOULS } from "@/utils/constants.ts";
import HeartIcon from "@/assets/images/heart.svg?raw";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";

const SoulHearts = () => {
  const container = createElementWithClass("div", css.hearts);

  SOULS.map(() => {
    const item = document.createElement("div");
    item.innerHTML = HeartIcon;
    container.append(item);
  });

  return container;
};

export default SoulHearts;
