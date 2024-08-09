import { CyanGame } from "@/levels/CyanHeart/CyanGame.ts";
import Intro from "../ui/Intro/Intro.ts";
import { HealthBar } from "@/ui/Health/Health.ts";
import { GameLevel } from "@/ui/GameLevel/GameLevel.ts";
import { Application } from "pixi.js";
import { Heart } from "@/utils/items/Heart.ts";
import { OrangeGame } from "@/levels/OrangeHeart/OrangeGame.ts";
import { BlueGame } from "@/levels/BlueHeart/BlueGame.ts";
import { PurpleGame } from "@/levels/PurpleHeart/PurpleGame.ts";
import { GreenGame } from "@/levels/GreenHeart/GreenGame.ts";
import { YellowGame } from "@/levels/YellowHeart/YellowGame.ts";
import { CurrentSoul } from "@/ui/CurrentHeart/CurrentHeart.ts";
import { GameOver } from "@/ui/GameOver/GameOver.ts";

export class View {
  private readonly health = HealthBar({});
  private readonly levels = [
    CyanGame,
    OrangeGame,
    BlueGame,
    PurpleGame,
    GreenGame,
    YellowGame,
  ];
  private currentLevel = 0;
  constructor(
    private readonly container: HTMLElement,
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  initialize() {
    // this.container.append(GameOver());
    this.container.append(Intro({ nextView: this.nextView }));
    // return this.setupView();
  }

  nextView = async () => {
    this.container.innerHTML = "";

    if (this.currentLevel < this.levels.length) {
      await this.setupView();
      this.currentLevel++;
    } else {
      console.log("All views completed!");
    }
  };

  setupView = async () => {
    const currentGame = this.levels[this.currentLevel];

    const game = new currentGame(
      this.app,
      this.heart,
      this.health.health,
      this.nextView,
    );
    console.log("CURRENT GAME", game);
    await GameLevel({ game, onLose: this.gameOver });

    const currentSoul = CurrentSoul({ soulIndex: this.currentLevel });
    this.container.append(currentSoul);

    this.container.append(this.app.canvas);
    this.container.append(this.health.container);
  };

  gameOver = () => {
    this.container.innerHTML = "";
    this.container.append(
      GameOver({
        onEnter: () => {
          this.health.health.setHealthPoints(20);
          this.container.innerHTML = "";
          this.currentLevel--;
          this.nextView();
        },
      }),
    );
  };
}
