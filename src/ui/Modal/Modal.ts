import css from "./Modal.module.css";
import { TypingEffect } from "@/ui/TypingEffect/TypingEffect.ts";

export class Modal {
  private visible: boolean = false;
  private modalElement: HTMLDivElement = document.createElement("div");
  private readonly typingEffect: TypingEffect;

  constructor(private readonly title: string) {
    this.modalElement.className = css["modal-wrapper"];
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

    const modalContent = document.createElement("div");
    modalContent.className = css["modal-content"];
    modalContent.appendChild(this.typingEffect.render());

    this.modalElement.appendChild(modalContent);
    document.body.appendChild(this.modalElement);
  }
}
