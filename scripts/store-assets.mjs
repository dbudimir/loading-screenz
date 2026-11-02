// Generates the Chrome Web Store screenshots and promo tiles in store/.
// Captures the real built extension (popup and a loading screen playing over a page),
// then lays each asset out as an HTML page styled with the extension's theme.
// Needs ffmpeg and ImageMagick (`magick`) on the PATH.
//
// Usage: pnpm store-assets

import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'store');
const THEME = pathToFileURL(join(ROOT, 'src/theme/index.css')).href;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Where in each video (as a fraction of its length) to take the still for tiles.
const STILLS = {
  halo: 0.45,
  'resident-evil': 0.25,
  'gta-san-andreas': 0.45,
  'crash-bandicoot': 0.45,
  'star-wars-battlefront': 0.12,
  ps2: 0.25,
  gamecube: 0.85,
  xbox: 0.65,
  dreamcast: 0.85,
};
const GAMES = [
  ['halo', 'Halo'],
  ['resident-evil', 'Resident Evil'],
  ['gta-san-andreas', 'GTA: San Andreas'],
  ['crash-bandicoot', 'Crash Bandicoot'],
  ['star-wars-battlefront', 'Star Wars Battlefront'],
];
const CONSOLES = [
  ['ps2', 'PlayStation 2'],
  ['gamecube', 'GameCube'],
  ['xbox', 'Xbox'],
  ['dreamcast', 'Dreamcast'],
];

// The loading screen shown in the first screenshot, and how far into it to capture.
const HERO_LOADER = 'xbox';
const HERO_SECONDS = 4.3;

const work = await mkdtemp(join(tmpdir(), 'store-assets-'));
await mkdir(OUT, { recursive: true });
execFileSync('node', ['build.mjs'], { cwd: ROOT, stdio: 'ignore' });

for (const [id, at] of Object.entries(STILLS)) {
  const src = join(ROOT, 'public/media', `${id}.mp4`);
  const duration = Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString()
  );
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(duration * at), '-i', src, '-frames:v', '1', '-vf', 'scale=960:-2', join(work, `${id}.png`)]);
}

const still = id => pathToFileURL(join(work, `${id}.png`)).href;
const file = name => pathToFileURL(join(work, name)).href;

const browser = await puppeteer.launch({ headless: true, pipe: true, enableExtensions: true });
const extensionId = await browser.installExtension(join(ROOT, 'dist'));
const page = await browser.newPage();

// The real popup, on a transparent background so it can be placed over the page mockup.
await page.setViewport({ width: 316, height: 600, deviceScaleFactor: 2 });
await page.goto(`chrome-extension://${extensionId}/popup.html`);
await page.evaluate(() => chrome.storage.sync.set({ enabled: true, frequency: 25, duration: 5, loader: 'random' }));
await page.reload();
await page.waitForFunction(() => document.querySelectorAll('optgroup').length > 0);
await page.addStyleTag({ content: 'html, body { background: transparent !important; }' });
await sleep(300);
const shell = await page.$('.lz-shell');
const box = await shell.boundingBox();
await page.screenshot({
  path: join(work, 'popup.png'),
  omitBackground: true,
  clip: { x: box.x - 6, y: box.y, width: box.width + 12, height: box.height + 10 },
});

// A loading screen playing for real, captured at the size of the browser mockup's content area.
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(req.url === '/next' ? '<p>Next page</p>' : '<a id="link" href="/next" style="display:block;height:100vh">Next</a>');
});
await new Promise(r => server.listen(0, r));
await page.goto(`chrome-extension://${extensionId}/popup.html`);
await page.evaluate(loader => chrome.storage.sync.set({ enabled: true, frequency: 100, duration: 15, loader }), HERO_LOADER);
await page.setViewport({ width: 1100, height: 560, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${server.address().port}/`);
await sleep(300);
await page.click('#link');
await sleep(HERO_SECONDS * 1000);
await page.screenshot({ path: join(work, 'overlay.png') });
server.close();

const head = (width, height, css = '') => `<!doctype html>
<html data-theme="xbox"><head><meta charset="utf-8"><link rel="stylesheet" href="${THEME}"><style>
  html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
  body { position: relative; font-family: var(--lz-font-body); }
  .stage { display: flex; flex-direction: column; align-items: center; gap: 22px; box-sizing: border-box; height: 100%; padding: 40px 90px 0; }
  .caption { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
  .caption .lz-display { font-size: 44px; }
  .caption .lz-text { color: #c9d8e8; font-size: 18px; }
  .logo-word { display: flex; flex-direction: column; color: #fff; font: italic 1em / 0.95 var(--lz-font-display); letter-spacing: 0.06em; text-transform: uppercase; text-shadow: 0 2px 3px rgb(0 0 0 / 0.6); }
  .logo-word b { color: var(--lz-accent-bright); }
  .orb { flex: none; border-radius: 50%; background: url(${pathToFileURL(join(ROOT, 'src/theme/logo-orb.svg')).href}) center / contain no-repeat; box-shadow: 0 0 30px var(--lz-accent-glow); }
  .window { flex: none; overflow: hidden; width: 1100px; border: 1px solid #000; border-radius: 10px 10px 0 0; box-shadow: 0 10px 40px rgb(0 0 0 / 0.6); }
  .window-bar { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 14px; background: linear-gradient(180deg, #e9ece9, #c5cac6); border-bottom: 1px solid #8a908b; }
  .window-dots { display: flex; gap: 7px; }
  .window-dots i { width: 12px; height: 12px; border-radius: 50%; background: #9da39f; box-shadow: inset 0 1px 1px rgb(0 0 0 / 0.3); }
  .window-url { flex: 1; height: 24px; padding: 0 12px; border-radius: 12px; background: #fff; box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.25); color: #555; font: 13px/24px var(--lz-font-body); }
  .window-icon { width: 22px; height: 22px; }
  .window-content { position: relative; height: 560px; }
  ${css}
</style></head>`;

const windowBar = (url, active = false) => `
  <div class="window-bar">
    <span class="window-dots"><i></i><i></i><i></i></span>
    <span class="window-url">${url}</span>
    <img class="window-icon" src="${pathToFileURL(join(ROOT, 'public/icons/icon48.png')).href}" style="${active ? 'filter: drop-shadow(0 0 4px var(--lz-accent-glow)); background: rgb(0 0 0 / 0.12); border-radius: 4px; padding: 3px; margin: -3px;' : ''}">
  </div>`;

const tiles = list =>
  list
    .map(
      ([id, name]) => `<figure class="lz-tile"><div class="lz-tile-frame"><img src="${still(id)}"></div><figcaption class="lz-tile-caption">${name}</figcaption></figure>`
    )
    .join('');

const assets = {
  'screenshot-1-loading-screen': [
    1280,
    800,
    `${head(1280, 800)}<body class="lz-texture-space">
      <div class="stage">
        <div class="caption">
          <h1 class="lz-display">Every click is a loading screen.</h1>
          <p class="lz-text">Classic game loading screens and console startups play before the next page opens.</p>
        </div>
        <div class="window">
          ${windowBar('www.example.com/next-page')}
          <div class="window-content"><img src="${file('overlay.png')}" style="display:block;width:100%;height:100%"></div>
        </div>
      </div>
    </body></html>`,
  ],
  'screenshot-2-popup': [
    1280,
    800,
    `${head(
      1280,
      800,
      `.page { position: absolute; inset: 0; padding: 28px 40px; background: #f4f5f4; }
       .page i { display: block; border-radius: 4px; background: #dfe2df; }
       .page .hero { height: 150px; margin: 18px 0; background: linear-gradient(90deg, #d5dad6, #e6e9e6); }
       .page .cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
       .page .cols i { height: 210px; }
       .popup { position: absolute; top: -4px; right: 2px; width: 420px; filter: drop-shadow(0 8px 18px rgb(0 0 0 / 0.45)); }`
    )}<body class="lz-texture-space">
      <div class="stage">
        <div class="caption">
          <h1 class="lz-display">Total control from the toolbar.</h1>
          <p class="lz-text">Flip the power, pick a screen or go random, and set how often and how long.</p>
        </div>
        <div class="window">
          ${windowBar('www.example.com', true)}
          <div class="window-content">
            <div class="page"><i style="width:180px;height:26px"></i><i class="hero"></i><div class="cols"><i></i><i></i><i></i></div></div>
            <img class="popup" src="${file('popup.png')}">
          </div>
        </div>
      </div>
    </body></html>`,
  ],
  'screenshot-3-lineup': [
    1280,
    800,
    `${head(
      1280,
      800,
      `.lineup { display: flex; flex-direction: column; gap: 16px; width: 1100px; box-sizing: border-box; padding: 22px 26px 26px; border-radius: 6px; }
       .lineup .lz-heading { font-size: 20px; }
       .row { display: flex; justify-content: center; gap: 18px; }
       .row .lz-tile { width: 190px; }
       .row .lz-tile-caption { font-size: 15px; }`
    )}<body class="lz-texture-space">
      <div class="stage">
        <div class="caption">
          <h1 class="lz-display">9 legendary screens built in.</h1>
          <p class="lz-text">Add your own videos too. They stay on your computer.</p>
        </div>
        <div class="lineup lz-screen">
          <h2 class="lz-heading">Game loading screens</h2>
          <div class="row">${tiles(GAMES)}</div>
          <h2 class="lz-heading">Console startups</h2>
          <div class="row">${tiles(CONSOLES)}</div>
        </div>
      </div>
    </body></html>`,
  ],
  'promo-small-440x280': [
    440,
    280,
    `${head(
      440,
      280,
      `.tile { display: flex; flex-direction: column; justify-content: center; gap: 18px; height: 100%; padding: 0 34px; box-sizing: border-box; }
       .brand { display: flex; align-items: center; gap: 18px; font-size: 40px; }
       .rail { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: var(--lz-rail); }
       .lz-heading { font-size: 19px; }`
    )}<body class="lz-texture-space">
      <div class="tile">
        <div class="brand"><span class="orb" style="width:74px;height:74px"></span><span class="logo-word">Loading <b>Screenz</b></span></div>
        <p class="lz-heading">Every click is a loading screen.</p>
      </div>
      <div class="rail"></div>
    </body></html>`,
  ],
  'promo-marquee-1400x560': [
    1400,
    560,
    `${head(
      1400,
      560,
      `.marquee { display: grid; grid-template-columns: 560px 1fr; align-items: center; height: 100%; padding: 0 70px; box-sizing: border-box; }
       .copy { display: flex; flex-direction: column; align-items: flex-start; gap: 22px; }
       .brand { display: flex; align-items: center; gap: 26px; font-size: 62px; }
       .copy .lz-heading { font-size: 28px; }
       .copy .lz-button { padding: 8px 26px; font-size: 22px; }
       .monitors { position: relative; height: 440px; }
       .monitors .lz-tile-frame { position: absolute; width: 400px; padding: 8px 8px 14px; }
       .rail { position: absolute; left: 0; right: 0; bottom: 0; height: 12px; background: var(--lz-rail); }`
    )}<body class="lz-texture-space">
      <div class="marquee">
        <div class="copy">
          <div class="brand"><span class="orb" style="width:110px;height:110px"></span><span class="logo-word">Loading <b>Screenz</b></span></div>
          <p class="lz-heading">Every click is a loading screen.</p>
          <span class="lz-button lz-button--primary">Free for Chrome</span>
        </div>
        <div class="monitors">
          <div class="lz-tile-frame" style="left:0;top:40px;transform:rotate(-4deg)"><img src="${still('gta-san-andreas')}"></div>
          <div class="lz-tile-frame" style="right:0;top:0;transform:rotate(3deg)"><img src="${still('xbox')}"></div>
          <div class="lz-tile-frame" style="left:150px;top:200px;z-index:1;transform:rotate(-1deg)"><img src="${still('halo')}"></div>
        </div>
      </div>
      <div class="rail"></div>
    </body></html>`,
  ],
};

for (const [name, [width, height, html]] of Object.entries(assets)) {
  const htmlPath = join(work, `${name}.html`);
  await writeFile(htmlPath, html);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href);
  await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
  const raw = join(work, `${name}.raw.png`);
  await page.screenshot({ path: raw });
  // The store wants 24-bit PNGs with no alpha channel.
  execFileSync('magick', [raw, '-background', 'black', '-alpha', 'remove', '-alpha', 'off', `PNG24:${join(OUT, `${name}.png`)}`]);
  console.log(`store/${name}.png (${width}x${height})`);
}

await browser.close();
await rm(work, { recursive: true, force: true });
