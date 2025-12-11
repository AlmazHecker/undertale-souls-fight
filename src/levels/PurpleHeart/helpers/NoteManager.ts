import { Application, Assets, Container } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import { areRectanglesColliding } from "@/utils/helpers/pixi.helper.ts";
import { Note } from "@/levels/PurpleHeart/assets/sprite/Note.ts";
import { GLOBAL_SCALE, HEIGHT } from "@/config/engine";

export class NoteManager {
  private moveSpeed = 3 * GLOBAL_SCALE;
  private noteHeight = Note.height * GLOBAL_SCALE;
  public leftNotes: Container[] = [];
  public rightNotes: Container[] = [];

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
    private readonly sideMargin: number,
    private readonly activeWidth: number
  ) {}

  async initialize() {
    const assets = await Assets.loadBundle("purple");

    const numNotesY = Math.ceil(HEIGHT / this.noteHeight) + 1;

    for (let y = 0; y <= numNotesY; y++) {
      const note = new Note(assets.note, this.sideMargin, y * this.noteHeight);
      this.leftNotes.push(note.container);
      this.app.stage.addChild(note.container);
    }

    for (let y = 0; y <= numNotesY; y++) {
      const note = new Note(
        assets.note,
        this.sideMargin + this.activeWidth,
        y * this.noteHeight
      );
      note.container.rotation = Math.PI;
      this.rightNotes.push(note.container);
      this.app.stage.addChild(note.container);
    }
  }

  public infiniteNotesAnimation() {
    const collisions: Container[] = [];

    this.updateLeftNotes(collisions);
    this.updateRightNotes(collisions);

    return collisions;
  }

  private updateLeftNotes(collisions: Container[]) {
    this.leftNotes.forEach((note) => {
      note.y += this.moveSpeed;
      if (note.y >= this.app.renderer.height) {
        note.y =
          Math.min(...this.leftNotes.map((n) => n.y)) - this.noteHeight + 10;
      }
      this.checkCollision(note, collisions);
    });
  }

  private updateRightNotes(collisions: Container[]) {
    this.rightNotes.forEach((note) => {
      note.y -= this.moveSpeed;
      if (note.y <= -this.noteHeight) {
        note.y =
          Math.max(...this.rightNotes.map((n) => n.y)) + this.noteHeight - 10;
      }
      this.checkCollision(note, collisions);
    });
  }

  private checkCollision(note: Container, collisions: Container[]) {
    const isDamaged = areRectanglesColliding(note, this.heart.container);
    if (isDamaged) collisions.push(note);
  }

  public async helpUser() {}

  public destroy() {
    this.leftNotes.forEach((sprite) => sprite.destroy());
    this.rightNotes.forEach((sprite) => sprite.destroy());
    this.leftNotes = [];
    this.rightNotes = [];
  }
}
