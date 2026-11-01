import { DEFAULT_SETTINGS, getSettings, onSettingsChanged, type Settings } from '../shared/settings';
import { showOverlay, type Overlay } from './overlay';

// Settings are cached because the click handler must decide synchronously whether to call preventDefault.
let settings: Settings = DEFAULT_SETTINGS;
const refreshSettings = () => getSettings().then(s => (settings = s));
refreshSettings();
onSettingsChanged(refreshSettings);

let active: { overlay: Overlay; timer: number } | null = null;

/** Returns the URL a click would navigate the current tab to, or null if it isn't a plain same-tab link navigation. */
function getNavigationUrl(event: MouseEvent): URL | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const link = event
    .composedPath()
    .find((el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement && el.hasAttribute('href'));
  if (!link || link.hasAttribute('download')) return null;
  if (link.target && link.target !== '_self') return null;

  const url = new URL(link.href);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const isSamePageAnchor = url.hash && url.href.split('#')[0] === location.href.split('#')[0];
  if (isSamePageAnchor) return null;

  return url;
}

// Listening in the bubble phase lets single-page apps handle (and preventDefault) their own client-side routing first.
window.addEventListener('click', event => {
  if (active || !settings.enabled) return;

  const url = getNavigationUrl(event);
  if (!url) return;
  if (Math.random() * 100 >= settings.frequency) return;

  event.preventDefault();
  // Navigate when the video ends (short videos end before Duration), or at Duration if it never does.
  const navigate = () => {
    clearTimeout(timer);
    location.assign(url.href);
  };
  const overlay = showOverlay(navigate);
  const timer = window.setTimeout(navigate, settings.duration * 1000);
  active = { overlay, timer };
});

// Pages restored from the back/forward cache would otherwise come back with the overlay still up.
window.addEventListener('pageshow', event => {
  if (!event.persisted || !active) return;
  clearTimeout(active.timer);
  active.overlay.remove();
  active = null;
});
