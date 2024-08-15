import { BaseGame } from "@/core/BaseGame.ts";
import { Modal } from "../Modal/Modal.ts";
import { animateWithTimer } from "@/utils/helpers/timing.helper.ts";
import { SHARED_SOUNDS } from "@/config/preload.ts";

type GameLevelArgs = {
  game: BaseGame;
  onLose: () => void;
  music: HTMLAudioElement;
};

export const GameLevel = async ({ game, music, onLose }: GameLevelArgs) => {
  await Promise.all([game.initialize(), music.play()]);

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
    SHARED_SOUNDS.breakSound.play();
    SHARED_SOUNDS.savedSound.play();
  };

  const statusListener = (status: string) => {
    if (["FINISH", "GAME_OVER"].includes(status)) {
      music.pause();
      music.remove();
      SHARED_SOUNDS.savedSound.stop();
      SHARED_SOUNDS.breakSound.stop();
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
