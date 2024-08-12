import { Sound } from "@/config/Sound.ts";

export const stopAudios = (
  audios: (HTMLAudioElement | Sound)[],
  remove: boolean = true,
) => {
  audios.forEach((audio) => {
    if (audio instanceof Sound) {
      audio.stop();
    } else {
      audio.pause();
      if (remove) audio.remove();
    }
  });
};
