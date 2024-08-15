import css from "./Credits.module.css";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";
import { Sound } from "@/config/Sound.ts";
import introSnd from "@/assets/music/mus_intronoise.ogg";

export class Credits {
  private readonly container = createElementWithClass("div", css.container);
  private readonly introSound = new Sound(introSnd);

  private txtContent = "";

  async initialize() {
    await this.introSound.load();
    this.txtContent = (await import("./content.txt?raw")).default;
  }

  renderContent() {
    this.introSound.play();
    const paragraph = createElementWithClass("p", css.content);
    paragraph.innerHTML = this.txtContent;

    this.container.append(paragraph);
    return this.container;
  }

  render() {
    this.introSound.play();
    const introText = createElementWithClass("p", css.intro);
    introText.innerHTML = "ALMAZYCH";
    this.container.append(introText);

    setTimeout(() => {
      this.container.innerHTML = "";
      this.renderContent();
    }, 3000);
    return this.container;
  }
}

//     paragraph.innerHTML = `This is my first 2D game on the web. It took me 31 days to develop, and I've realized there's a lot to explore on the frontend. It's not just about buttons and inputs - graphics play a huge role too. Before this, I had zero knowledge of graphics. Developing this game taught me about running JavaScript on both the GPU and CPU.
//
// Well, I used to think that developing games on the web was super hard and that the web wasn’t ready for it. But now I know—anything can be developed on the web!
//
// P.S, you're mining cryptocurrency for me while reading this text xd
// `;
