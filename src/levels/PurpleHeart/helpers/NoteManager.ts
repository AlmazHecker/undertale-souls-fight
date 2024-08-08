import { Application, Assets, Container } from "pixi.js";
import { Heart } from "@/utils/items/Heart.tsx";
import notePng from "@/levels/PurpleHeart/assets/img/note.png";
import { areRectanglesColliding } from "@/utils/helpers/pixi.helper.ts";
import { Note } from "@/levels/PurpleHeart/assets/sprite/Note.ts";

export class NoteManager {
  private moveSpeed = 3;
  private noteHeight = 238;
  public leftNotes: Container[] = [];
  public rightNotes: Container[] = [];

  constructor(
    private readonly app: Application,
    private readonly heart: Heart,
  ) {}

  async initialize() {
    const noteTexture = await Assets.load(notePng);

    const numNotesY = Math.ceil(this.app.renderer.height / this.noteHeight) + 1;
    const canvasWidth = this.app.renderer.width;

    for (let y = 0; y <= numNotesY; y++) {
      const note = new Note(noteTexture, 0, y * this.noteHeight);
      note.container.label = "note";
      this.leftNotes.push(note.container);
      this.app.stage.addChild(note.container);
    }

    for (let y = 0; y <= numNotesY; y++) {
      const note = new Note(noteTexture, canvasWidth, y * this.noteHeight);
      note.container.rotation = Math.PI;
      note.container.label = "note";
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
    this.leftNotes = [];
    this.rightNotes = [];
    this.app.stage.removeChild(...this.leftNotes, ...this.rightNotes);
  }
}
