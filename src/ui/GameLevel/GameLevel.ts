import { BaseGame } from "../../utils/helpers/BaseGame.ts";
import { Modal } from "../Modal/Modal.ts";

type GameLevelArgs = {
  game: BaseGame;
};
export const GameLevel = async ({ game }: GameLevelArgs) => {
  await game.initialize();

  const modal = new Modal("* You called for help...");

  game.heart.keyboardHandler.keyDownMiddleware = (event: KeyboardEvent) => {
    if (event.key === "Enter" && game.isBtnAndHeartColliding) {
      modal.show();
      game.emit("status", "HELP_REQUESTED");
    }
  };
  game.on("status", (status: string) => {
    if (status === "FINISH") {
      game.destroy();
      modal.hide();
    }
  });
};
