import gameOverVideo from "@/assets/video/game_over.webm";
import css from "./GameOver.module.css";
import { TypingEffect } from "@/ui/TypingEffect/TypingEffect.ts";
import { getRandomIndex } from "@/utils/helpers/random.helper.ts";
import gameOverSnd from "@/assets/music/mus_gameover.ogg";
import { animateWithTimer, sleep } from "@/utils/helpers/timing.helper.ts";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";

type GameOverProps = {
  onExit: () => void;
};
const gameOverSound = new Audio(gameOverSnd);
export const GameOver = ({ onExit }: GameOverProps) => {
  gameOverSound.loop = true;

  const container = createElementWithClass("div", css.container);
  const content = createElementWithClass("div", css.content);
  const title = createElementWithClass("h2", css.title);
  title.textContent = "GAME OVER";

  const helperText = createElementWithClass("span", css.helpertext);
  helperText.textContent = "Press ENTER to start";

  const text = MESSAGES[getRandomIndex(MESSAGES)];
  const typingText = new TypingEffect({
    text,
    className: css.message,
    speed: 80,
    soundEnabled: true,
  });

  const video = createElementWithClass<"video">("video", css.video);
  video.src = gameOverVideo;
  video.autoplay = true;
  video.width = 800;
  video.height = 500;

  const handleEnterClick = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      typingText.remove();
      const newText = new TypingEffect({
        text: "Stay determined...",
        className: css.message,
        speed: 80,
        soundEnabled: true,
      });
      content.appendChild(newText.render());
      window.addEventListener("keydown", destroy, { once: true });
    }
  };

  const destroy = async () => {
    await animateWithTimer(1500, (progress) => {
      container.style.opacity = `${1 - progress}`;
    });
    await sleep(500);
    gameOverSound.pause();
    gameOverSound.remove();
    onExit();
  };

  video.onended = () => {
    video.remove();
    content.appendChild(title);
    container.append(content, helperText);
    gameOverSound.play();
    setTimeout(() => {
      content.appendChild(typingText.render());
      window.addEventListener("keydown", handleEnterClick, { once: true });
    }, 1200);
  };

  container.appendChild(video);

  return container;
};

const MESSAGES = [
  "Don't lose hope...",
  "You cannot give up just yet...",
  "IDGAF",
];
