import { BaseGame } from "@/utils/helpers/BaseGame.ts";
import { Modal } from "../Modal/Modal.ts";

type GameLevelArgs = {
  game: BaseGame;
  onLose: () => void;
};
export const GameLevel = async ({ game, onLose }: GameLevelArgs) => {
  await game.initialize();

  const modal = new Modal("* You called for help...");

  game.heart.keyboardHandler.keyDownMiddleware = (event: KeyboardEvent) => {
    if (event.key === "Enter" && game.isBtnAndHeartColliding) {
      modal.show();
      game.emit("status", "HELP_REQUESTED");
    }
  };

  game.on("status", (status: string) => {
    if (["FINISH", "GAME_OVER"].includes(status)) {
      game.destroy();
      game.health.off("health", healthListener);
      modal.hide();
    }
    if (status === "GAME_OVER") onLose();
  });

  const healthListener = (healthPoints: number) => {
    if (healthPoints === 0) {
      game.emit("status", "GAME_OVER");
    }
  };

  game.health.on("health", healthListener);
};
