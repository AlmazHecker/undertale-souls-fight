import "./SoulHearts.css";
import { SOULS } from "@/utils/constants.ts";
import HeartIcon from "@/assets/images/heart.svg?raw";

const SoulHearts = () => {
  const container = document.createElement("div");
  container.className = "hearts";

  SOULS.map(() => {
    const item = document.createElement("div");
    item.innerHTML = HeartIcon;
    container.append(item);
  });

  return container;
};

export default SoulHearts;
