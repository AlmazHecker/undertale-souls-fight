import SoulHearts from "./SoulHearts.ts";
import Button from "../Button/Button.ts";
import { Sound } from "@/config/Sound.ts";
import noiseSnd from "@/assets/music/snd_noise.wav";
import battleFall from "@/assets/music/snd_battlefall.wav";

const animateElements = async (elements: HTMLCollection): Promise<boolean> => {
  const blinkSound = await new Sound(noiseSnd).load();

  return new Promise((resolve) => {
    const fadeInDuration = 140;
    const blinkDuration = 140;
    const totalAnimations = 1;
    let animationsCompleted = 0;

    const handleAnimation = (element: HTMLElement, index: number) => {
      const originaTransition = getComputedStyle(element).transition;

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
          element.style.transition = originaTransition;
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
  const button = Button({ text: "START GAME" });
  button.style.margin = "0 auto";
  button.onclick = async () => {
    button.disabled = true;

    const playBattleFallSound = await new Sound(battleFall).load();
    await animateElements(hearts.children);

    setTimeout(() => playBattleFallSound.play(), 300);
    setTimeout(nextView, 900);
  };

  const container = document.createElement("div");
  container.append(hearts, button);

  return container;
};

export default Intro;
