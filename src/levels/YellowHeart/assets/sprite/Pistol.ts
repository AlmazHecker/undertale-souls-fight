import * as PIXI from "pixi.js";
import { ItemOptions } from "@/utils/types.ts";
import { BaseItem } from "@/utils/items/BaseItem.ts";

export class Pistol extends BaseItem {
  constructor(options: ItemOptions) {
    const sprite = new PIXI.Sprite(options.texture);
    super(sprite, options.x, options.y, options.width, options.height);
    this.container._zIndex = 2;
    this.centerWithPivot();

    this.container.hitArea = this.toPolygon(svgPoints);
  }
}

const svgPoints = [
  68.5, 2.5, 56.540504455566406, 2.500004529953003, 44.58100509643555,
  2.5000035762786865, 32.62150573730469, 2.500002384185791, 20.662010192871094,
  2.5000014305114746, 8.702510833740234, 2.500000476837158, 12.245588302612305,
  2.0818779468536377, 24.1989688873291, 1.7101597785949707, 36.15792465209961,
  1.625925898551941, 48.116188049316406, 1.7844061851501465, 60.07014083862305,
  2.144818067550659, 67.97787475585938, 2.5000054836273193, 56.01837158203125,
  2.500004529953003, 44.05888366699219, 2.5000035762786865, 32.09938049316406,
  2.500002384185791, 20.139892578125, 2.5000014305114746, 8.180389404296875,
  2.500000238418579, 12.77911376953125, 2.5, 24.73860168457031, 2.5,
  36.69810485839844, 2.5, 48.65760803222656, 2.5, 60.617095947265625, 2.5,
  69.5057144165039, 6.374141693115234, 60.611141204833984, 12.070263862609863,
  48.656131744384766, 12.392653465270996, 36.69732666015625, 12.502381324768066,
  24.738431930541992, 12.399563789367676, 12.783234596252441,
  12.084318161010742, 4.965258598327637, 4.24484395980835, 12.1527099609375, 0,
  24.1121826171875, 0, 36.071685791015625, 0, 48.03118896484375, 0,
  59.990692138671875, 0, 68.67191314697266, 5.328094005584717,
  99.00559997558594, 8.650876998901367, 87.04623413085938, 8.692863464355469,
  75.08740234375, 8.808428764343262, 69.42105865478516, 5.202363967895508,
  81.34619140625, 5, 93.3056945800781, 5, 104.6322021484375, 2.877701759338379,
  69.29029846191406, 8.999510765075684, 81.24970245361328, 8.949624061584473,
  93.20849609375, 8.81985092163086, 105.16615295410156, 8.614481925964355,
  103.87599182128906, 8.57792854309082, 91.91735076904297, 8.718618392944336,
  79.9586486816406, 8.859309196472168, 68, 9,
];
