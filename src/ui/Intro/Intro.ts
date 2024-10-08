import SoulHearts from "./SoulHearts.ts";
import Button from "../Button/Button.ts";
import { SHARED_SOUNDS } from "@/config/preload.ts";

const animateElements = async (elements: HTMLCollection): Promise<boolean> => {
  const blinkSound = SHARED_SOUNDS.blinkSound;

  return new Promise((resolve) => {
    const fadeInDuration = 140;
    const blinkDuration = 140;
    const totalAnimations = 1;
    let animationsCompleted = 0;

    const handleAnimation = (element: HTMLElement, index: number) => {
      const originalTransition = getComputedStyle(element).transition;

      const blink = () => {
        element.classList.add("blink");
        blinkSound.play();
        setTimeout(() => {
          blinkSound.play();
          element.classList.remove("blink");
          animationsCompleted++;
          if (animationsCompleted === elements.length * totalAnimations) {
            resolve(true);
          }
        }, blinkDuration);
      };

      for (let i = 0; i < totalAnimations; i++) {
        let currentTime = 0;
        setTimeout(
          () => {
            element.style.transition = `opacity ${fadeInDuration / 1000}s`;
            element.style.opacity = "1";
            setTimeout(blink, currentTime);
            currentTime += blinkDuration;
          },
          index * (fadeInDuration + blinkDuration) + i * blinkDuration,
        );
      }

      setTimeout(
        () => {
          element.style.transition = originalTransition;
        },
        (index + 1) * (fadeInDuration + blinkDuration),
      );
    };

    Array.from(elements).forEach((el, idx) =>
      handleAnimation(el as HTMLElement, idx),
    );
  });
};

type IntroProps = {
  nextView: () => void;
};
const Intro = ({ nextView }: IntroProps) => {
  const hearts = SoulHearts();
  const button = Button({ text: "* START GAME" });
  button.style.margin = "0 auto";

  const enterListener = (event: KeyboardEvent) => {
    return event.key === "Enter" && onButtonClick();
  };
  window.addEventListener("keydown", enterListener);

  const onButtonClick = async () => {
    window.removeEventListener("keydown", enterListener);
    button.disabled = true;

    const playBattleFallSound = SHARED_SOUNDS.battleFall;
    await animateElements(hearts.children);

    setTimeout(() => playBattleFallSound.play(), 300);
    setTimeout(nextView, 900);
  };

  button.addEventListener("click", onButtonClick, { once: true });

  const container = document.createElement("div");
  container.append(hearts, button);

  return container;
};

export default Intro;
