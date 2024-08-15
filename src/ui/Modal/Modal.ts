import css from "./Modal.module.css";
import { TypingEffect } from "@/ui/TypingEffect/TypingEffect.ts";
import { createElementWithClass } from "@/utils/helpers/dom.helper.ts";

export class Modal {
  private visible: boolean = false;
  private modalElement = createElementWithClass("div", css["modal-wrapper"]);
  private readonly typingEffect: TypingEffect;

  constructor(private readonly title: string) {
    this.typingEffect = new TypingEffect({ text: this.title });
  }

  show() {
    if (!this.visible) {
      this.visible = true;
      this.render();
    }
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      this.modalElement.remove();
      this.typingEffect.remove();
    }
  }

  render() {
    if (!this.visible) return;

    const modalContent = createElementWithClass("div", css["modal-content"]);
    modalContent.appendChild(this.typingEffect.render());

    this.modalElement.appendChild(modalContent);
    document.body.appendChild(this.modalElement);
  }
}
