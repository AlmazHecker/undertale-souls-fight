import { CyanGame } from "@/levels/CyanHeart/CyanGame.ts";
import Intro from "../ui/Intro/Intro.ts";
import { Health } from "@/ui/Health/Health.ts";
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
import snd1 from "@/assets/music/mus_f_6s_1.ogg";
import snd2 from "@/assets/music/mus_f_6s_2.ogg";
import snd3 from "@/assets/music/mus_f_6s_3.ogg";
import snd4 from "@/assets/music/mus_f_6s_4.ogg";
import snd5 from "@/assets/music/mus_f_6s_5.ogg";
import snd6 from "@/assets/music/mus_f_6s_6.ogg";
import { Credits } from "@/ui/Credits/Credits.ts";
const audios = [snd1, snd2, snd3, snd4, snd5, snd6];

export class View {
  private readonly health = new Health();
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

  async initialize() {
    await this.health.initialize();
  }

  nextView = async () => {
    this.container.innerHTML = "";

    if (this.currentLevel < this.levels.length) {
      await this.setupView();
      this.currentLevel++;
    } else {
      const credits = new Credits();
      await credits.initialize();
      this.container.append(credits.render());
    }
  };

  setupView = async () => {
    const CurrentGame = this.levels[this.currentLevel];

    const game = new CurrentGame(
      this.app,
      this.heart,
      this.health,
      this.nextView,
    );
    this.heart.container.x = this.app.renderer.width / 2;
    this.heart.container.y = this.app.renderer.height / 2;

    const music = new Audio(audios[this.currentLevel]);
    music.loop = true;

    await GameLevel({ game, onLose: this.gameOver, music });

    const currentSoul = CurrentSoul({ soulIndex: this.currentLevel });
    this.container.append(currentSoul, this.app.canvas, this.health.container);
  };

  gameOver = () => {
    this.container.innerHTML = "";
    this.container.append(
      GameOver({
        onExit: () => {
          this.health.setHealthPoints(20, false);
          this.container.innerHTML = "";
          this.currentLevel--;
          this.nextView();
        },
      }),
    );
  };

  render() {
    this.container.append(Intro({ nextView: this.nextView }));
    return this.container;
  }
}
