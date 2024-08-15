import snd1 from "@/assets/music/mus_f_6s_1.ogg";
import snd2 from "@/assets/music/mus_f_6s_2.ogg";
import snd3 from "@/assets/music/mus_f_6s_3.ogg";
import snd4 from "@/assets/music/mus_f_6s_4.ogg";
import snd5 from "@/assets/music/mus_f_6s_5.ogg";
import snd6 from "@/assets/music/mus_f_6s_6.ogg";

import { Sound } from "@/config/Sound.ts";
import breakSnd from "@/assets/music/snd_break.wav";
import savedSnd from "@/assets/music/mus_f_saved.ogg";
import typingSnd from "@/assets/music/snd_txtasg.wav";
import healSnd from "@/assets/music/snd_heal_c.wav";
import hurtSnd from "@/assets/music/snd_hurt.wav";
import noiseSnd from "@/assets/music/snd_noise.wav";
import battleFallSnd from "@/assets/music/snd_battlefall.wav";
import introSnd from "@/assets/music/mus_intronoise.ogg";

const audios = [snd1, snd2, snd3, snd4, snd5, snd6];
function preloadSound(src: string) {
  return new Promise<HTMLAudioElement>((resolve, reject) => {
    const audio = new Audio(src);

    audio.addEventListener("canplaythrough", () => resolve(audio), false);
    audio.addEventListener(
      "error",
      () => reject(new Error(`${src} failed to load`)),
      false,
    );

    audio.load();
  });
}

export const SHARED_SOUNDS: Record<string, Sound> = {};

export const preloadSharedSounds = async () => {
  const [
    breakSound,
    savedSound,
    typingSound,
    healSound,
    hurtSound,
    blinkSound,
    battleFall,
    introSound,
  ] = await Promise.all([
    new Sound(breakSnd).load(),
    new Sound(savedSnd).load(),
    new Sound(typingSnd).load(),
    new Sound(healSnd).load(),
    new Sound(hurtSnd).load(),
    new Sound(noiseSnd).load(),
    new Sound(battleFallSnd).load(),
    new Sound(introSnd).load(),
  ]);
  SHARED_SOUNDS.breakSound = breakSound;
  SHARED_SOUNDS.savedSound = savedSound;
  SHARED_SOUNDS.typingSound = typingSound;
  SHARED_SOUNDS.healSound = healSound;
  SHARED_SOUNDS.hurtSound = hurtSound;
  SHARED_SOUNDS.blinkSound = blinkSound;
  SHARED_SOUNDS.battleFall = battleFall;
  SHARED_SOUNDS.introSound = introSound;
};

export const preloadMp3 = () => {
  return Promise.all(audios.map(preloadSound));
};
