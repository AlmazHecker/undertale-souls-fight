import type { AssetsManifest } from "pixi.js";
import shoePng from "@/levels/BlueHeart/assets/img/shoe.png";
import starPng from "@/levels/BlueHeart/assets/img/star.png";
import musicPng from "@/levels/BlueHeart/assets/img/music.png";
import knifePng from "@/levels/CyanHeart/assets/img/knife.png";
import plasterPng from "@/levels/CyanHeart/assets/img/plaster.png";
import glovePng from "@/levels/OrangeHeart/assets/img/glove.png";
import likePng from "@/levels/OrangeHeart/assets/img/like.png";
import notePng from "@/levels/PurpleHeart/assets/img/note.png";
import panPng from "@/levels/GreenHeart/assets/img/pan.png";
import firePng from "@/levels/GreenHeart/assets/img/fire.png";
import eggPng from "@/levels/GreenHeart/assets/img/egg.png";
import pistolPng from "@/levels/YellowHeart/assets/img/pistol.png";
import bulletPng from "@/levels/YellowHeart/assets/img/bullet.png";
import pistolAimPng from "@/levels/YellowHeart/assets/img/pistol-aim.png";
import heartAimPng from "@/levels/YellowHeart/assets/img/heart-aim.png";
import flowerPng from "@/levels/YellowHeart/assets/img/flower.png";

export const PIXI_ASSETS_MANIFEST: AssetsManifest = {
  bundles: [
    {
      name: "blue",
      assets: [
        { alias: "shoe", src: shoePng },
        { alias: "star", src: starPng },
        { alias: "music", src: musicPng },
      ],
    },
    {
      name: "cyan",
      assets: [
        { alias: "knife", src: knifePng },
        { alias: "plaster", src: plasterPng },
      ],
    },
    {
      name: "orange",
      assets: [
        { alias: "glove", src: glovePng },
        { alias: "like", src: likePng },
      ],
    },
    {
      name: "purple",
      assets: [{ alias: "note", src: notePng }],
    },
    {
      name: "green",
      assets: [
        { alias: "pan", src: panPng },
        { alias: "fire", src: firePng },
        { alias: "egg", src: eggPng },
      ],
    },
    {
      name: "yellow",
      assets: [
        { alias: "pistol", src: pistolPng },
        { alias: "bullet", src: bulletPng },
        { alias: "pistolAim", src: pistolAimPng },
        { alias: "heartAim", src: heartAimPng },
        { alias: "flower", src: flowerPng },
      ],
    },
  ],
};

export const SOULS = [
  { color: "cyan", label: "Patience" },
  { color: "orange", label: "Bravery" },
  { color: "blue", label: "Integrity" },
  { color: "purple", label: "Perseverance" },
  { color: "green", label: "Kindness" },
  { color: "yellow", label: "Justice" },
];
