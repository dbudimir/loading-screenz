# Plan: hosting loading screens remotely

Status: researched and prototyped (October 2026), not built.

Update: the local video library (v1.1.0) added the extension player page this design depends on (`public/player.html`, `src/player/main.ts`), along with a `Loader` union type in `src/shared/loaders.ts`. A YouTube or remote source would be a third loader variant that the player embeds or downloads, alongside built-in and uploaded videos.

## Goal

Distribute the extension with many loading screens without bundling every video in the extension package or paying to host them. The main idea is to host the videos as unlisted YouTube videos and pass the extension a list of links, keeping the ability to adjust playback speed.

## Summary

YouTube hosting works, with three major tradeoffs:

1. **Speed is capped at 2×.** The YouTube player only allows 0.25× to 2×, so a video can only be fit to the Duration setting if it's at most twice as long. Uploads should be cut or pre-sped to roughly the target length.
2. **YouTube branding stays visible.** The title, channel avatar, "More videos", and YouTube logo show on the player. YouTube's embedded player policies don't allow covering or modifying them.
3. **Error 153 needs a workaround.** YouTube rejects embeds that don't send a website Referer header, which includes embeds from extension pages. Setting the header with `declarativeNetRequest` fixes it.

An alternative that keeps full speed control and has no branding is free static hosting with local caching, described [below](#alternative-free-static-hosting-with-local-caching).

## Prototype results

Tested with a throwaway MV3 extension in Chrome for Testing (Puppeteer), using the [Halo CE 4K recreation](https://www.youtube.com/watch?v=Iv0LpwfJEps) video.

| Test | Result |
| --- | --- |
| Embed `youtube.com/embed/<id>` or `youtube-nocookie.com/embed/<id>` from an extension page | **Error 153** ("Video player configuration error"). |
| Same, with the Referer header set via `declarativeNetRequest` | **Works.** Playing about 0.5–0.9s after the click (browser already warm). |
| Same, routed through a static web page that embeds YouTube and relays messages | **Works.** Similar timing. |
| Site with a strict CSP (`frame-src 'none'`) | **Works.** The page's CSP can't block the extension's own iframe, and the YouTube iframe lives inside it. |
| `setPlaybackRate` 2, 4, 8, 16 | 2 works. Higher values are ignored and it stays at 2. `availablePlaybackRates` is `[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]`. |

## Proposed design

```
web page
└── <loading-screenz-overlay> (content script, closed shadow root)
    └── <iframe src="chrome-extension://<id>/player.html?video=<youtube id>">   web accessible
        └── <iframe src="https://www.youtube-nocookie.com/embed/<id>?...">
```

- **Extension player page (`player.html`).** The content script injects it instead of a `<video>` element. Pages can't block it with CSP, and it gives YouTube a consistent parent to embed in.
- **No YouTube IFrame API script.** MV3 and the Chrome Web Store forbid remotely hosted code, so `https://www.youtube.com/iframe_api` can't be loaded. The player page talks to the embed directly with the same `postMessage` protocol the API uses (see [Player messaging](#player-messaging)).
- **Referer fix.** A `declarativeNetRequest` rule sets the `Referer` header on the extension's YouTube embed requests. YouTube recommends this for apps without a web origin. Scope it to requests initiated by the extension, so other sites' YouTube embeds aren't affected.
- **Privacy.** Use `youtube-nocookie.com`.
- **Fallback.** Keep one small bundled video. If YouTube doesn't report "playing" within about 1.5s, or reports an error, switch to it.

### Embed URL

```
https://www.youtube-nocookie.com/embed/<id>
  ?enablejsapi=1      enable postMessage control
  &autoplay=1
  &mute=1             muted autoplay is always allowed
  &controls=0
  &playsinline=1
  &rel=0              related videos only from the same channel
  &origin=<chrome-extension://id>   must match the embedding page's real origin, or YouTube won't send events back
```

Optional: `&start=<s>&end=<s>` to play a segment, `&loop=1&playlist=<id>` to loop.

### Referer rule

Needs `"permissions": ["declarativeNetRequestWithHostAccess"]` and `"host_permissions": ["https://www.youtube-nocookie.com/*"]`. Prototype version (session rule set from the player page; a real build would set it on install from a service worker, or as a static rule):

```js
await chrome.declarativeNetRequest.updateSessionRules({
  removeRuleIds: [1],
  addRules: [{
    id: 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [{ header: 'referer', operation: 'set', value: 'https://<a domain we own>/' }],
    },
    condition: {
      requestDomains: ['youtube.com', 'youtube-nocookie.com'],
      initiatorDomains: [chrome.runtime.id],
      resourceTypes: ['sub_frame'],
    },
  }],
});
```

The alternative to this rule is a tiny static page on GitHub Pages that embeds YouTube and relays `postMessage` traffic both ways. It avoids the extra permission, but adds a remote page the extension depends on.

### Player messaging

Messages to the embed are JSON strings posted to `iframe.contentWindow`:

```js
const send = (func, args = []) =>
  iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args, id: 1, channel: 'widget' }), '*');

// After the iframe's load event, repeat until the first reply arrives:
iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*');

send('setPlaybackRate', [2]);
send('unMute');
```

Replies arrive as `message` events from `iframe.contentWindow` with JSON strings:

- `initialDelivery` and `onReady`: the player is ready. `info` includes `availablePlaybackRates` and `duration`.
- `infoDelivery`: state updates. `info.playerState` is -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued. Also `playbackRate`, `currentTime`, `videoLoadedFraction`.
- `onError`: error codes (for example 100 not found, 101/150 embedding disabled).

### Speed

Rate = video length ÷ Duration, clamped to the available rates (0.25–2). To keep the loading screen fitting the duration:

- Upload versions already cut or sped up to about 5–10 seconds, then fine-tune with the rate.
- Or use `start`/`end` to play only a segment.
- Otherwise the video just gets cut off when the page navigates.

### Start-up time

- Show the black background and vignette immediately on click, and fade the video in when `playerState` becomes 1.
- Warm up on `pointerover`/`pointerdown` of a link by creating the hidden player early, for a few hundred ms of head start.
- Don't preload the player on every page load. It's over 1 MB of YouTube JavaScript per page, plus YouTube seeing every site visited.
- Keep the navigation timer starting at the click so a slow YouTube load never delays navigation beyond Duration.

### Configuring the list of videos

Each loader in `src/shared/loaders.ts` becomes either a bundled file or a YouTube ID:

```ts
type LoaderSource = { type: 'file'; path: string } | { type: 'youtube'; id: string; start?: number; end?: number };
```

Ways to supply YouTube IDs, from simplest:

1. Hard-coded in `loaders.ts` (needs a release to change).
2. Pasted into the popup by the user (stored in `chrome.storage.sync`).
3. A JSON list fetched from a GitHub repo (raw file or GitHub Pages). Lets you add loading screens without a new release. The Chrome Web Store allows remote data, not remote code. Needs a host permission for wherever the list lives.

Unlisted videos embed fine. Private videos don't. "Allow embedding" must be on for each video in YouTube Studio.

## Risks and open questions

- **YouTube policy.** The YouTube API Services policies don't allow obscuring or modifying the player or its branding. Our vignette overlay and any cropping of the player's chrome would count. Decide how much overlay is acceptable for a published extension.
- **Error 153 could change.** YouTube introduced the Referer requirement in 2025 and may tighten it further.
- **Install warning.** YouTube host access and `declarativeNetRequest` add to the permissions warning.
- **Sound.** Autoplay must start muted. Unmuting through the nested iframes after the click wasn't verified.
- **Ads and Content ID.** Monetized videos can show pre-roll ads. Uploads of Halo footage may get Content ID claims, which can add ads or block playback in some regions.
- **Cold-start timing.** Timings above were measured with a warm browser. Measure first-load latency on a cold cache and slower connections.
- **Offline.** YouTube loaders won't work offline; the bundled fallback covers this.

## Alternative: free static hosting with local caching

If the goal is mainly no server and no hosting bill, the MP4 files can live on free static hosting instead:

- GitHub Releases assets, or a GitHub Pages site.
- Cloudflare R2 (free tier with no egress fees).

The extension would download each video once, store it in Cache Storage or IndexedDB, and play it from a local blob URL in the same `player.html` setup. Compared with YouTube:

| | YouTube | Static hosting + cache |
| --- | --- | --- |
| Speed range | 0.25–2× | 0.0625–16× |
| Branding | YouTube UI visible | None |
| Start-up | About 0.5–1s every time | Instant after first play |
| Ads / Content ID | Possible | No |
| Who hosts | YouTube | You (free tier) |
| Extra permissions | YouTube host access, `declarativeNetRequest` | Host access for the file host |

A hybrid is also possible: support both source types per loader and pick per video.
