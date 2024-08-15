import css from "./TypingEffect.module.css";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";
import { SHARED_SOUNDS } from "@/config/preload.ts";

type TypingEffectProps = {
  text: string;
  speed?: number;
  className?: string;
  onAnimationEnd?: () => void;
  soundEnabled?: boolean;
};

export class TypingEffect {
  private readonly typingSound = SHARED_SOUNDS.typingSound;
  private readonly container = createElementWithClass(
    "div",
    css["typing-effect"],
  );
  private readonly speed: number = 50;
  private readonly onAnimationEnd?: () => void;
  private readonly soundEnabled: boolean = false;
  private text: string;
  private charIndex: number;

  constructor(options: TypingEffectProps) {
    this.text = options.text;
    this.speed = options.speed || 50;
    this.soundEnabled = options.soundEnabled || false;
    if (options.className) this.container.classList.add(options.className);
    this.container.textContent = "";
    this.container.style.minWidth = `${options.text.length - 1}ch`;
    this.onAnimationEnd = options.onAnimationEnd;
    this.charIndex = 0;
    this.typeNextChar = this.typeNextChar.bind(this);
  }

  public typeNextChar() {
    if (this.soundEnabled) this.typingSound.play(0.7);

    if (this.charIndex < this.text.length) {
      const currentChar = this.text.charAt(this.charIndex);
      this.container.textContent += currentChar;
      this.charIndex++;
      setTimeout(this.typeNextChar, this.speed);
    } else {
      if (this.onAnimationEnd) this.onAnimationEnd();
    }
  }

  public remove() {
    this.typingSound.stop();
    this.container.remove();
  }

  public render() {
    this.typeNextChar();
    return this.container;
  }
}
