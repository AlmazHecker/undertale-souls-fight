import { ContainerChild } from "pixi.js";

export const getRandomIndex = (arr: unknown[]) => {
  return Math.floor(Math.random() * arr.length);
};

export const getRandomBoolean = () => Math.random() >= 0.5;

export const getRandomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const shuffleArray = (array: ContainerChild[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
