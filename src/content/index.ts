import { DEFAULT_SETTINGS, getSettings, onSettingsChanged, type Settings } from '../shared/settings';
import { showOverlay, type Overlay } from './overlay';

// Settings are cached because the click handler must decide synchronously whether to call preventDefault.
let settings: Settings = DEFAULT_SETTINGS;
const refreshSettings = () => getSettings().then(s => (settings = s));
refreshSettings();
onSettingsChanged(refreshSettings);

// How long the overlay waits for the page to unload after navigating before giving up and removing itself.
const UNLOAD_TIMEOUT_MS = 5000;

let active: { overlay: Overlay; timer: number; listeners: AbortController } | null = null;

function dismiss() {
  if (!active) return;
  clearTimeout(active.timer);
  active.listeners.abort();
  active.overlay.remove();
  active = null;
}

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
  let navigated = false;
  const navigate = () => {
    if (navigated || !active) return;
    navigated = true;
    clearTimeout(active.timer);
    // Single-page apps (like Reddit) can intercept the navigation and route in-page, so the page never unloads.
    const { signal } = active.listeners;
    navigation.addEventListener('navigatesuccess', dismiss, { signal });
    navigation.addEventListener('navigateerror', dismiss, { signal });
    location.assign(url.href);
    // Covers navigations that never replace the page at all: downloads, 204 responses, a cancelled "Leave site?" prompt.
    active.timer = window.setTimeout(dismiss, UNLOAD_TIMEOUT_MS);
  };
  active = {
    overlay: showOverlay(navigate),
    timer: window.setTimeout(navigate, settings.duration * 1000),
    listeners: new AbortController(),
  };
});

// Pages restored from the back/forward cache would otherwise come back with the overlay still up.
window.addEventListener('pageshow', event => {
  if (event.persisted) dismiss();
});
