import css from "./Health.module.css";
import EventEmitter from "eventemitter3";
import { Sound } from "@/config/Sound.ts";
import healSnd from "@/assets/music/snd_heal_c.wav";
import hurtSnd from "@/assets/music/snd_hurt.wav";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";

interface Events {
  health: (points: number) => void;
}

export class Health extends EventEmitter<Events> {
  private readonly healSound = new Sound(healSnd);
  private readonly hurtSound = new Sound(hurtSnd);

  public container = createElementWithClass("div", css["health-bar"]);
  public healthPoint = createElementWithClass("div", css["health-point"]);
  constructor(
    public points = 20,
    public maxPoints = 20,
  ) {
    super();
    this.calculateStyleWidth();
  }

  async initialize() {
    await Promise.all([this.healSound.load(), this.hurtSound.load()]);

    this.container.append(this.healthPoint);
  }

  incrementHealth() {
    this.points = Math.min(this.points + 1, this.maxPoints);
    this.healSound.play();
    this.calculateStyleWidth();
    this.emit("health", this.points);
  }

  decrementHealth() {
    this.points = Math.max(this.points - 1, 0);
    this.hurtSound.play();
    this.calculateStyleWidth();
    this.emit("health", this.points);
  }

  setHealthPoints(value: number, sound: boolean = true) {
    let val = this.points + value;
    const isHealing = value > 0;

    if (sound) {
      if (isHealing) {
        this.healSound.play();
      } else {
        this.hurtSound.play();
      }
    }

    if (val > this.maxPoints) {
      val = this.maxPoints;
    } else if (val < 0) {
      val = 0;
    }
    this.points = val;
    this.calculateStyleWidth();
    this.emit("health", this.points);
  }

  private calculateStyleWidth = () => {
    this.healthPoint.style.width = `${(this.points / this.maxPoints) * 100}%`;
  };
}
