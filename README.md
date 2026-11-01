# Loading Screens (loading-screenz)

A browser extension that turns link clicks into classic video game loading screens and console startups. When you click a link, there's a chance a fullscreen loading video plays for a few seconds before the browser continues to the page.

Built on Manifest V3 for Chrome and other Chromium browsers (Edge, Brave, Arc, Opera, Vivaldi), version 120 or newer.

## Features

- Fullscreen loading video on link clicks, with a vignette over the top.
- A library of loading screens: built-in Halo, Resident Evil, GTA: San Andreas, Crash Bandicoot, PlayStation 2, GameCube, Xbox, and Dreamcast videos to start, plus your own videos added from your computer.
- Pick one loading screen in the popup or let it choose at random, with control over which videos are in the random rotation.
- Adjustable frequency (how often it triggers) and duration (how long it lasts). The video's speed is adjusted so it plays through once in that time.
- Doesn't break normal browsing: new-tab and modifier clicks, downloads, same-page anchors, and links that the site handles itself (single-page app routing) all behave normally.
- All videos are stored inside the extension, so it works offline and on sites with strict security policies.
- No data leaves your browser, no background script, and a 1.7 KB content script.

## Install

You need [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io).

```sh
git clone https://github.com/dbudimir/loading-screenz
cd loading-screenz
pnpm install
pnpm build
```

Then load the `dist/` folder into your browser:

1. Open the extensions page: `chrome://extensions`, `edge://extensions`, `brave://extensions`, or your browser's equivalent.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select the `dist/` folder.
4. Pin the Loading Screens icon to the toolbar to get to the settings.

Pages that were already open before loading the extension need a refresh before it works on them.

## Settings

Click the toolbar icon to open the popup. Changes save automatically and apply to open tabs right away.

| Setting | Default | What it does |
| --- | --- | --- |
| Enabled | On | Turns loading screens on or off without uninstalling. |
| Loading screen | Random | Which video from your library to play, or Random to pick one each time. |
| Frequency | 25% | Chance that a link click shows a loading screen (1–100%). |
| Duration | 5s | The longest the loading screen stays up before navigating (1–15 seconds). Videos longer than this are sped up to fit; shorter videos play at normal speed and end the loading screen when they finish. |

Settings are stored in `chrome.storage.sync`, so they follow you to other computers signed in to the same browser profile.

## Your library

Click **Manage library…** in the popup (or right-click the toolbar icon and choose **Options**) to open the library page. It groups videos into **Game loading screens**, **Console startups**, and **Your videos**, and the popup's menu uses the same groups. From there you can:

- **Add videos** by dropping files onto the page or clicking **Choose files**. You can add several at once. Each file is test-loaded first, and files Chrome can't play are rejected with a message. MP4 (H.264) and WebM work everywhere; MOV and HEVC depend on the computer.
- **Preview** any loading screen by hovering over it.
- **Rename** your videos by clicking the name.
- **Choose what Random picks from** with the **In Random rotation** checkbox on each video, built-in ones included. If everything is unchecked, Random uses the whole library.
- **Delete** your videos. Built-in videos can't be deleted, only left out of the rotation.

Added videos are copied into the extension's own storage (IndexedDB), so moving or deleting the original file doesn't affect them. They stay on that computer only: they don't sync to other browsers, and uninstalling the extension deletes them. The `unlimitedStorage` permission removes the browser's storage limit, and the library page shows how much space the extension is using.

Clips up to 15 seconds look best. Longer videos get sped up to fit the Duration setting, and a video's own length is the longest its loading screen can last.

## Built-in loading screens

These ship with the extension, so everyone who installs it starts with them in their library.

### Game loading screens

| Name | File | Length | Source |
| --- | --- | --- | --- |
| Halo | `public/media/halo.mp4` | 15s, 1080p30, 314 KB | Halo CE 4K recreation by [JustinsaneS222 on YouTube](https://www.youtube.com/watch?v=Iv0LpwfJEps) |
| Resident Evil | `public/media/resident-evil.mp4` | 5.8s, 480p30, 46 KB | Door-opening animation by [VideoPie on YouTube](https://www.youtube.com/watch?v=ZNU29JfzKOI) |
| GTA: San Andreas | `public/media/gta-san-andreas.mp4` | 15s, 720p30, 513 KB | Loading screen capture by [Charleezy on YouTube](https://www.youtube.com/watch?v=TllPuFVRKqc) |
| Crash Bandicoot | `public/media/crash-bandicoot.mp4` | 15s, 720p30, 730 KB | The Wrath of Cortex loading screen capture by [NoahFuel Gaming on YouTube](https://www.youtube.com/watch?v=0RqI2x7Vq64) |

### Console startups

| Name | File | Length | Source |
| --- | --- | --- | --- |
| PlayStation 2 | `public/media/ps2.mp4` | 15s, 1080p30 (4:3), 396 KB | PS2 startup capture by [politoed1 on YouTube](https://www.youtube.com/watch?v=YWWjTYlSp2M) |
| GameCube | `public/media/gamecube.mp4` | 5.5s, 1080p30, 207 KB | GameCube startup capture by [ploxyzero on YouTube](https://www.youtube.com/watch?v=Fnz9ljn1cwE) |
| Xbox | `public/media/xbox.mp4` | 9.5s, 1080p30, 483 KB | Original Xbox startup capture by [TroJan_Virus on YouTube](https://www.youtube.com/watch?v=oADANrDGhoQ) |
| Dreamcast | `public/media/dreamcast.mp4` | 9.3s, 1080p30, 143 KB | Dreamcast startup capture by [pixer on YouTube](https://www.youtube.com/watch?v=jCcm4uxyfcs) |

Built-in videos are up to 15 seconds long, matching the longest Duration setting. A 15-second video plays at normal speed at 15 seconds, 3× at the default 5 seconds, and 15× at 1 second. A shorter video caps the loading screen at its own length.

### Adding a built-in loading screen

To ship a new video to everyone (rather than adding it to just your own library):

1. Encode the source video into `public/media/` with the encode script (needs `ffmpeg`, for example `brew install ffmpeg`):

   ```sh
   pnpm encode ~/Downloads/source.mp4 --id my-loader
   ```

   This writes `public/media/my-loader.mp4` in the standard built-in format:
   - **Codec:** AV1 video at CRF 38 and Opus audio, in MP4.
   - **Picture:** at most 1080p and 30fps.
   - **Length:** at most 15 seconds. Longer sources are sped up to fit, and shorter ones keep their own length.

   Expect about 150–600 KB per 15-second video, depending on how busy the footage is. Options:

   | Option | Default | What it does |
   | --- | --- | --- |
   | `--id` | From the file name | Output file name and loader id |
   | `--start`, `--end` | Whole video | Seconds to cut from the source before fitting it to the length |
   | `--length` | `15` | Maximum length in seconds |
   | `--crf` | `38` | AV1 quality: lower is better and bigger (30–45 is a sensible range) |
   | `--height` | `1080` | Maximum height. 720 saves a lot on soft or busy footage that gains nothing from 1080p |
   | `--no-audio` | Off | Drop the audio track (saves about 60 KB) |

   For a video on YouTube, `pnpm youtube` downloads it and runs the encode script for you (it also needs [uv](https://docs.astral.sh/uv/) for `yt-dlp`). Inspect it first, then encode with the same options as above:

   ```sh
   pnpm youtube "https://www.youtube.com/watch?v=..." --inspect
   pnpm youtube "https://www.youtube.com/watch?v=..." --id my-loader --start 0.4 --end 9.3
   ```

   `--inspect` prints the title, uploader, and black stretches at the start or end (with suggested `--start` and `--end` trims). It also saves frame sheets to `/tmp/loading-screenz/<video id>/` so you can pick trim points. The encode pass saves a frame sheet of the result in the same folder. `.cursor/rules/add-youtube-loader.mdc` has the full checklist for Cursor's agent.

2. Add an entry to `BUILT_IN_LOADERS` in `src/shared/loaders.ts`. The `id` must stay the same in future releases, because users' settings refer to it.

   ```ts
   { id: 'my-loader', name: 'My Loader', builtIn: true, category: 'game', path: 'media/my-loader.mp4' },
   ```

   `category` is `'game'` for in-game loading screens or `'console'` for console startup animations. It decides which group the video appears under in the popup and the library page.

   The player darkens the edges of the screen with a vignette, which suits dark footage. For videos with a light background (like Dreamcast's white screen), add `vignette: false`.

3. Rebuild and reload the extension. The new screen appears in the library, the popup menu, and the Random rotation.

Keep built-in files small (a few MB at most), since they make the extension package bigger for everyone.

### Hosting videos remotely

Bundled videos make the extension package bigger with every loading screen. [docs/remote-video-hosting.md](docs/remote-video-hosting.md) is a researched (not yet built) plan for loading them from unlisted YouTube videos or free static hosting instead.

## Development

```sh
pnpm dev
```

This builds into `dist/` with inline source maps and rebuilds whenever a file changes. Load `dist/` as described in [Install](#install). After each rebuild:

- **Popup, library page, or player changes:** close and reopen the popup or library page. The player reloads on every loading screen.
- **Content script, manifest, or media changes:** click the reload icon on the extension's card in the extensions page, then refresh the tab you're testing in.

To test quickly, set Frequency to 100% so every click triggers a loading screen. Content script and player logs appear in the page's DevTools console (choose the Loading Screens context in the console's context menu for the player). For the popup, right-click inside it and choose **Inspect**. The library page is a normal tab with its own DevTools, and **Application → IndexedDB → loading-screenz** shows the stored videos.

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development build with source maps, rebuilding on change |
| `pnpm build` | Minified production build into `dist/` |
| `pnpm typecheck` | Type-check the project with TypeScript |
| `pnpm encode <file>` | Encode a video as a built-in loading screen (see [Adding a built-in loading screen](#adding-a-built-in-loading-screen)) |
| `pnpm youtube <url>` | Download a YouTube video and encode it as a built-in (`--inspect` to look first) |
| `pnpm icons` | Render `public/icons/` from the SVGs in `assets/icons/` (needs Chrome and ImageMagick) |
| `pnpm styleguide` | Build and open the design system style guide (see `docs/design-system.md`) |
| `pnpm zip` | Production build, zipped to `loading-screenz.zip` (without the style guide) |

### Tech stack

- TypeScript and React 19 for the popup and library page. The content script and player are plain DOM code.
- [esbuild](https://esbuild.github.io) for bundling, configured in `build.mjs`. Every entry is bundled as a standalone script because content scripts can't load ES modules.
- pnpm for packages. esbuild's install script is allowed in `pnpm-workspace.yaml`; pnpm blocks dependency install scripts unless they're approved.

## Project structure

```
├── build.mjs               Build script: copies public/ to dist/ and bundles src/
├── site/                   Marketing site (Next.js, deployed on Vercel). See site/README.md
├── assets/icons/           Icon sources: icon.svg (48px and up) and icon-small.svg (16px and 32px)
├── scripts/
│   ├── encode.mjs          Encodes a source video into an AV1 built-in loader (15 seconds at most)
│   ├── icons.mjs           Renders the icon PNGs from assets/icons/
│   └── youtube.mjs         Downloads a YouTube video, inspects it, and runs encode.mjs
├── public/                 Copied into dist/ unchanged
│   ├── manifest.json       Extension manifest (Manifest V3)
│   ├── popup.html          Popup page shell
│   ├── options.html        Library page shell
│   ├── player.html         Fullscreen player page shown inside the overlay
│   ├── styleguide.html     Design system style guide (not shipped)
│   ├── icons/              Toolbar and store icons
│   └── media/              Built-in loading screen videos
└── src/
    ├── content/
    │   ├── index.ts        Runs on web pages: decides which clicks get a loading screen
    │   └── overlay.ts      Covers the page with the player
    ├── player/
    │   ├── main.ts         Picks a loading screen and plays it, fitted to Duration
    │   └── player.css
    ├── popup/
    │   ├── main.tsx        Settings popup (React)
    │   └── popup.css
    ├── options/
    │   ├── main.tsx        Library page: add, preview, rename, delete (React)
    │   └── options.css
    ├── theme/
    │   ├── tokens.css      Fonts, sizes, spacing, and bevels shared by every theme
    │   ├── themes/         One file of color and texture tokens per console theme
    │   └── components.css  The lz- components, built only from tokens
    ├── styleguide/         Style guide page showing every component and mockups of the UI
    └── shared/
        ├── loaders.ts      Built-in loaders, the combined library, and random picking
        ├── user-videos.ts  IndexedDB storage for uploaded videos
        └── settings.ts     Settings shape, defaults, and storage helpers
```

## How it works

1. The content script runs on every `http` and `https` page and keeps a copy of the current settings, updating it when they change.
2. It listens for clicks in the bubble phase, after the page's own handlers have run. If the page already called `preventDefault()` (as single-page app routers do), the click is ignored.
3. It also skips anything that isn't a plain same-tab navigation: middle or modifier clicks, `target="_blank"`, `download` links, same-page `#anchors`, and non-web URLs like `mailto:`.
4. Otherwise it rolls against Frequency. On a hit, it cancels the navigation and adds the overlay: a black custom element with a closed shadow root at the highest z-index, so the page's CSS and scripts can't reach it.
5. The overlay contains an iframe of the extension's `player.html`. Because the player runs as an extension page, it can read uploaded videos from the extension's IndexedDB (web pages and content scripts can't), and the site's Content Security Policy can't block it.
6. The player reads the settings and library, picks the selected loading screen (or a random one from the rotation), and plays it: built-in videos from the extension package, uploaded ones from a `blob:` URL. A video longer than Duration is sped up to fit (its length divided by Duration, up to Chrome's 16× limit); a shorter one plays at normal speed. If the browser blocks autoplay with sound, it falls back to muted playback.
7. The content script navigates to the link when the player reports that the video ended, or after Duration seconds if that comes first (for example, if a video fails to load). If you come back with the Back button and the browser restores the page from its back/forward cache, the overlay is removed.

## Publishing

```sh
pnpm zip
```

This creates `loading-screenz.zip`, which you can upload in the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) or [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge). Bump `version` in `public/manifest.json` before each upload.

Before publishing, keep in mind:

- The built-in videos (a fan recreation of the Halo CE loading screen, the Resident Evil door animation, the GTA: San Andreas and Crash Bandicoot loading screens, and captures of the PlayStation 2, GameCube, Xbox, and Dreamcast startups) aren't released under an open license. Get permission from the rights holders or replace them before distributing the extension publicly.
- The store will ask you to justify running on all sites (the `http://*/*` and `https://*/*` content script matches) and `unlimitedStorage` (for videos users add to their library), and to provide a privacy policy. The extension collects no data; settings stay in the browser's sync storage and uploaded videos stay on the user's computer.

## Troubleshooting

**The loading screen never shows.**
Check that the extension is enabled in the popup and try Frequency at 100%. Refresh the tab after installing or reloading the extension. Extensions can't run on browser pages like `chrome://` URLs, the Chrome Web Store, or local `file://` pages.

**Some links never show it.**
That's intentional for links opened in new tabs, Cmd/Ctrl/Shift/middle clicks, downloads, `#anchor` links, and links handled by the site's own JavaScript (common in single-page apps like YouTube and GitHub).

**A video won't add to the library.**
The message under the drop zone says why. Usually Chrome can't decode the format (for example some MOV, HEVC, or AVI files). Convert it to MP4: `ffmpeg -i input.mov -c:v libx264 -c:a aac -movflags +faststart output.mp4`.

**My videos disappeared.**
Library videos live in the extension's storage on one computer. They aren't synced, and removing the extension (or installing it as a different unpacked copy, which gets a different extension ID) starts with an empty library.

**The video plays without sound.**
Some sites or browser settings block autoplay with audio, so the extension falls back to muted playback.

**`pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`.**
A dependency with an install script isn't approved. Run `pnpm approve-builds` and approve it (this is already done for esbuild in `pnpm-workspace.yaml`).

## License and acknowledgments

Code is licensed under BSD-3-Clause.

- Halo video (Halo CE 4K recreation) by [JustinsaneS222](https://www.youtube.com/watch?v=Iv0LpwfJEps).
- Resident Evil door-opening animation by [VideoPie](https://www.youtube.com/watch?v=ZNU29JfzKOI). Resident Evil is a trademark of Capcom.
- GTA: San Andreas loading screen capture by [Charleezy](https://www.youtube.com/watch?v=TllPuFVRKqc). Grand Theft Auto is a trademark of Take-Two Interactive.
- Crash Bandicoot: The Wrath of Cortex loading screen capture by [NoahFuel Gaming](https://www.youtube.com/watch?v=0RqI2x7Vq64). Crash Bandicoot is a trademark of Activision.
- PlayStation 2 startup capture by [politoed1](https://www.youtube.com/watch?v=YWWjTYlSp2M). PlayStation is a trademark of Sony Interactive Entertainment.
- GameCube startup capture by [ploxyzero](https://www.youtube.com/watch?v=Fnz9ljn1cwE). GameCube is a trademark of Nintendo.
- Xbox startup capture by [TroJan_Virus](https://www.youtube.com/watch?v=oADANrDGhoQ). Xbox is a trademark of Microsoft.
- Dreamcast startup capture by [pixer](https://www.youtube.com/watch?v=jCcm4uxyfcs). Dreamcast is a trademark of Sega.
- Halo and Halo: Combat Evolved are trademarks of Microsoft. This project isn't affiliated with or endorsed by Microsoft or Bungie.
- Originally based on the [Duo Labs Chrome extension boilerplate](https://github.com/duo-labs/chrome-extension-boilerplate).
