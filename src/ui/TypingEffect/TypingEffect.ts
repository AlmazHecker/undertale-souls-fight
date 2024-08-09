import css from "./TypingEffect.module.css";

type TypingEffectProps = {
  text: string;
  speed?: number;
  className?: string;
  onAnimationEnd?: () => void;
};

export class TypingEffect {
  private readonly container: HTMLDivElement;
  private readonly speed: number = 50;
  private readonly onAnimationEnd?: () => void;
  private text: string;
  private charIndex: number;

  constructor(options: TypingEffectProps) {
    this.text = options.text;
    this.speed = options.speed || 50;
    this.container = document.createElement("div");
    this.container.className = css["typing-effect"];
    if (options.className) this.container.classList.add(options.className);
    this.container.textContent = "";
    this.container.style.minWidth = `${options.text.length - 1}ch`;
    this.onAnimationEnd = options.onAnimationEnd;
    this.charIndex = 0;

    this.typeNextChar = this.typeNextChar.bind(this);
  }

  typeNextChar() {
    if (this.charIndex < this.text.length) {
      const currentChar = this.text.charAt(this.charIndex);
      this.container.textContent += currentChar;
      this.charIndex++;
      setTimeout(this.typeNextChar, this.speed);
    } else {
      if (this.onAnimationEnd) this.onAnimationEnd();
    }
  }

  remove() {
    this.container.remove();
  }

  render() {
    this.typeNextChar();
    return this.container;
  }
}
