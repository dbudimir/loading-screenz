import { PLAYER_ENDED_MESSAGE } from '../shared/messages';

export interface Overlay {
  remove: () => void;
}

/**
 * Covers the page with the extension's player page. The player runs in the extension's origin, so it can read
 * uploaded videos from the extension's IndexedDB and isn't affected by the page's Content Security Policy.
 * `onEnded` runs when the video finishes playing.
 */
export function showOverlay(onEnded: () => void): Overlay {
  // A custom element name plus a closed shadow root keeps page styles and scripts from touching the overlay.
  const host = document.createElement('loading-screenz-overlay');
  // Styles are set through CSSOM because strict page CSPs can block style attributes and <style> elements.
  const hostStyles: Record<string, string> = {
    all: 'initial',
    position: 'fixed',
    inset: '0',
    'z-index': '2147483647',
    background: '#000',
  };
  for (const [property, value] of Object.entries(hostStyles)) host.style.setProperty(property, value, 'important');

  const frame = document.createElement('iframe');
  frame.src = chrome.runtime.getURL('player.html');
  frame.allow = 'autoplay';
  frame.style.setProperty('border', '0');
  frame.style.setProperty('display', 'block');
  frame.style.setProperty('width', '100%');
  frame.style.setProperty('height', '100%');

  const onMessage = (event: MessageEvent) => {
    if (event.source === frame.contentWindow && event.data === PLAYER_ENDED_MESSAGE) onEnded();
  };
  window.addEventListener('message', onMessage);

  host.attachShadow({ mode: 'closed' }).append(frame);
  document.documentElement.append(host);

  return {
    remove: () => {
      window.removeEventListener('message', onMessage);
      host.remove();
    },
  };
}
