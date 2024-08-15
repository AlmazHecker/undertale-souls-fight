import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";
import css from "./Loader.module.css";

export const Loader = () => {
  return createElementWithClass("span", css.loader);
};
