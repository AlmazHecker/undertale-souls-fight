import css from "./Button.module.css";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";

type ButtonProps = Partial<HTMLButtonElement> & {
  text: string;
};

const Button = (props: ButtonProps) => {
  const button = createElementWithClass<"button">("button", css.button);
  button.textContent = props.text;

  return button;
};

export default Button;
