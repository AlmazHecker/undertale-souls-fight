import "./Button.css";

type ButtonProps = Partial<HTMLButtonElement> & {
  text: string;
};
const Button = (props: ButtonProps) => {
  const button = document.createElement("button");
  button.textContent = props.text;
  button.className = "button";

  return button;
};

export default Button;
