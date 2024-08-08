import css from "./Modal.module.css";

export class Modal {
  private visible: boolean = false;
  private modalElement: HTMLDivElement = document.createElement("div");
  private styleElement: HTMLStyleElement = document.createElement("style");

  constructor(private readonly title: string) {
    this.modalElement.className = css["modal-wrapper"];
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
      this.styleElement.remove();
    }
  }

  render() {
    if (!this.visible) return;

    const modalContent = document.createElement("div");
    modalContent.className = css["modal-content"];

    const typingEffect = document.createElement("div");
    typingEffect.className = css["typing-effect"];
    typingEffect.textContent = this.title;

    modalContent.appendChild(typingEffect);
    this.modalElement.appendChild(modalContent);
    document.body.appendChild(this.modalElement);

    this.styleElement.innerHTML = `
          .${css["typing-effect"]}::after {
            animation: typingEffect 1s steps(${this.title.length}) forwards;
          }
        `;
    document.head.appendChild(this.styleElement);
  }
}
