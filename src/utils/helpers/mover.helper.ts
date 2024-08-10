export class KeyboardHandler {
  public keyDownMiddleware?: (event: KeyboardEvent) => void;
  public keyupMiddleware?: (event: KeyboardEvent) => void;
  keyState = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  constructor() {}

  setup() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  cleanup() {
    window.removeEventListener("keydown", this.onKeyDown.bind(this));
    window.removeEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key in this.keyState) {
      this.keyState[event.key as keyof typeof this.keyState] = true;
    }
    if (this.keyDownMiddleware) this.keyDownMiddleware(event);
  }

  private onKeyUp(event: KeyboardEvent) {
    if (event.key in this.keyState) {
      this.keyState[event.key as keyof typeof this.keyState] = false;
    }
    if (this.keyupMiddleware) this.keyupMiddleware(event);
  }
}
