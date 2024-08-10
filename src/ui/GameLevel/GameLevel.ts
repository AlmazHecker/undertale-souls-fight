import { BaseGame } from "@/utils/helpers/BaseGame.ts";
import { Modal } from "../Modal/Modal.ts";
import { animateWithTimer } from "@/utils/helpers/timing.helper.ts";

import helpingSnd from "@/assets/music/snd_break.wav";
import savedSnd from "@/assets/music/mus_f_saved.ogg";
import { stopAudios } from "@/utils/helpers/audio.helper.ts";

type GameLevelArgs = {
  game: BaseGame;
  onLose: () => void;
  music: HTMLAudioElement;
};

const breakSound = new Audio(helpingSnd);
const savedSound = new Audio(savedSnd);

export const GameLevel = async ({ game, music, onLose }: GameLevelArgs) => {
  await game.initialize();
  // await music.play();

  const modal = new Modal("* You called for help...");

  game.heart.keyboardHandler.keyDownMiddleware = (event: KeyboardEvent) => {
    if (event.key === "Enter" && game.isBtnAndHeartColliding) {
      modal.show();
      setTimeout(requestHelp, Math.random() * 2000 + 2000);
    }
  };

  const requestHelp = () => {
    if (["FINISH", "GAME_OVER"].includes(game.status)) {
      return;
    }
    animateWithTimer(3000, (progress) => {
      if (progress >= 1) {
        stopAudios([music]);
        return;
      }
      music.preservesPitch = false;
      music.playbackRate = 1 - 0.5 * progress;
    }).then(() => {
      game.emit("status", "HELP_REQUESTED");
      breakSound.play();
      savedSound.play();
    });
  };

  const statusListener = (status: string) => {
    if (["FINISH", "GAME_OVER"].includes(status)) {
      stopAudios([savedSound, breakSound, music]);
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
