import { getLibrary, getLoaderUrl, pickLoader } from '../shared/loaders';
import { PLAYER_ENDED_MESSAGE } from '../shared/messages';
import { getSettings } from '../shared/settings';
import './player.css';

// Chrome's maximum playbackRate.
const MAX_RATE = 16;

async function play() {
  const [settings, library] = await Promise.all([getSettings(), getLibrary()]);
  const loader = pickLoader(library, settings);
  const src = loader && (await getLoaderUrl(loader));
  if (!src) return;

  document.querySelector<HTMLElement>('.vignette')!.hidden = loader.builtIn && loader.vignette === false;

  const video = document.querySelector('video')!;
  video.addEventListener('loadedmetadata', () => {
    if (!Number.isFinite(video.duration)) return;
    // Videos longer than Duration are sped up to fit. Shorter ones play at normal speed and end the loader early.
    video.playbackRate = Math.min(MAX_RATE, Math.max(1, video.duration / settings.duration));
  });
  video.addEventListener('ended', () => parent.postMessage(PLAYER_ENDED_MESSAGE, '*'));
  video.src = src;

  video.play().catch(() => {
    // Some pages block autoplay with sound, so fall back to muted playback.
    video.muted = true;
    video.play().catch(() => {});
  });
}

play();
