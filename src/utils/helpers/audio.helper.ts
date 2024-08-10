export const stopAudios = (
  audios: HTMLAudioElement[],
  remove: boolean = true,
) => {
  audios.forEach((audio) => {
    audio.pause();
    if (remove) audio.remove();
  });
};
