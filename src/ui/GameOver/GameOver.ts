import gameOverVideo from "@/assets/video/game_over.mp4";
import css from "./GameOver.module.css";
import { TypingEffect } from "@/ui/TypingEffect/TypingEffect.ts";
import { getRandomIndex } from "@/utils/helpers/random.helper.ts";
import gameOverSnd from "@/assets/music/mus_gameover.ogg";

type GameOverProps = {
  onEnter: () => void;
};
export const GameOver = ({ onEnter }: GameOverProps) => {
  const gameOverSound = new Audio(gameOverSnd);
  gameOverSound.loop = true;
  gameOverSound.autoplay;

  const container = document.createElement("div");
  container.className = css.container;

  const content = document.createElement("div");
  content.className = css.content;

  const title = document.createElement("h2");
  title.className = css.title;
  title.textContent = "GAME OVER";

  const helperText = document.createElement("span");
  helperText.textContent = "Press ENTER to start";
  helperText.className = css.helpertext;

  const text = MESSAGES[getRandomIndex(MESSAGES)];

  const typingText = new TypingEffect({
    text,
    className: css.message,
    speed: 80,
  });

  const handleEnterClick = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      typingText.remove();

      const newText = new TypingEffect({
        text: "Stay determined...",
        className: css.message,
        speed: 80,
      });
      content.appendChild(newText.render());

      window.addEventListener("keydown", destroy, { once: true });
    }
  };

  const destroy = () => {
    gameOverSound.pause();
    gameOverSound.remove();
    onEnter();
  };

  const video = document.createElement("video");
  video.className = css.video;
  video.src = gameOverVideo;
  video.autoplay = true;
  video.width = 800;
  video.height = 500;
  video.onended = () => {
    video.remove();
    content.appendChild(title);
    container.appendChild(content);
    container.appendChild(helperText);
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
