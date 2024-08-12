import { BaseGame } from "@/utils/helpers/BaseGame.ts";
import { Modal } from "../Modal/Modal.ts";
import { animateWithTimer } from "@/utils/helpers/timing.helper.ts";

import helpingSnd from "@/assets/music/snd_break.wav";
import savedSnd from "@/assets/music/mus_f_saved.ogg";
import { Sound } from "@/config/Sound.ts";

type GameLevelArgs = {
  game: BaseGame;
  onLose: () => void;
  music: HTMLAudioElement;
};

const breakSound = new Sound(helpingSnd);
const savedSound = new Sound(savedSnd);

export const GameLevel = async ({ game, music, onLose }: GameLevelArgs) => {
  await Promise.all([
    game.initialize(),
    breakSound.load(),
    savedSound.load(),
    music.play(),
  ]);

  const modal = new Modal("* You called for help...");

  game.heart.keyboardHandler.keyDownMiddleware = (event: KeyboardEvent) => {
    if (event.key === "Enter" && game.isBtnAndHeartColliding) {
      modal.show();
      game.heart.keyboardHandler.keyDownMiddleware = undefined;
      setTimeout(requestHelp, Math.random() * 2000 + 2000);
    }
  };

  const requestHelp = async () => {
    // Если чел проиграл - помощи не будет
    if (["FINISH", "GAME_OVER"].includes(game.status)) return;

    game.emit("status", "PREPARING_HELP");
    await animateWithTimer(3000, async (progress) => {
      if (progress >= 1) {
        music.pause();
        return music.remove();
      }

      music.preservesPitch = false;
      music.playbackRate = 1 - 0.5 * progress;
    });
    game.emit("status", "HELP_REQUESTED");
    breakSound.play();
    savedSound.play();
  };

  const statusListener = (status: string) => {
    if (["FINISH", "GAME_OVER"].includes(status)) {
      music.pause();
      music.remove();
      savedSound.stop();
      breakSound.stop();
      game.destroy();
      game.health.off("health", healthListener);
      modal.hide();
    }
    if (status === "GAME_OVER") onLose();
  };

  game.on("status", statusListener);

  const healthListener = (healthPoints: number) => {
    if (healthPoints === 0) {
      game.emit("status", "GAME_OVER");
    }
  };

  game.health.on("health", healthListener);
};
