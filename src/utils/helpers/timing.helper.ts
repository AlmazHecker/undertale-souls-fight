import { Container, Text, Ticker } from "pixi.js";
import { getRandomInRange } from "./random.helper.ts";
import { createTicker } from "./pixi.helper.ts";

export const animateWithTimer = (
  duration: number,
  onUpdate: (progress: number, destroy: () => void) => void,
  easingFunction: (t: number) => number = (t) => t,
) => {
  return new Promise<void>((resolve) => {
    let startTime: number | null = null;
    const ticker = createTicker();

    const destroyLoop = () => {
      ticker.remove(animate);
      resolve();
    };
    const animate = (ticker: Ticker) => {
      if (!startTime) {
        startTime = ticker.lastTime;
      }

      const elapsed = ticker.lastTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const elapsedProgress = easingFunction(progress);
      onUpdate(elapsedProgress, destroyLoop);

      if (progress >= 1) {
        ticker.remove(animate);
        resolve();
      }
    };

    ticker.add(animate);
    ticker.start();
  });
};

export const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;

export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const easeOutIn = (t: number) =>
  t < 0.5 ? 1 - 2 * (1 - t) * (1 - t) : 2 * (t - 0.5) * (t - 0.5);

export const cubicEaseInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number) => -Math.pow(1 - t, 3);

export type VibrateOptions = {
  container: Text | Container;
  intensity?: number;
  duration: number;
  x?: number;
  y?: number;
};

export const vibrate = async ({
  container,
  duration,
  intensity = 20,
  x,
  y,
}: VibrateOptions) => {
  await animateWithTimer(duration, () => {
    if (y) {
      const offsetY = getRandomInRange(-3, 3);
      container.y = Math.max(
        y - intensity,
        Math.min(y + intensity, container.y + offsetY),
      );
    }
    if (x) {
      const offsetX = getRandomInRange(-3, 3);
      container.x = Math.max(
        x - intensity,
        Math.min(x + intensity, container.x + offsetX),
      );
    }
  });
};

export const callInfinitely = async (
  func: () => Promise<void>,
  condition: boolean,
) => {
  while (condition) {
    await func();
  }
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
