// Renders the extension icons in public/icons/ from the SVGs in assets/icons/.
// Each SVG is drawn at 512px with headless Chrome, then scaled down with ImageMagick for clean edges.
//
// Usage: pnpm icons   (set CHROME to use a Chrome binary other than the default macOS install)

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RENDER_SIZE = 512;
const outputs = [
  { source: 'assets/icons/icon-small.svg', sizes: [16, 32] },
  { source: 'assets/icons/icon.svg', sizes: [48, 128] },
];

const workDir = mkdtempSync(join(tmpdir(), 'icons-'));
try {
  for (const { source, sizes } of outputs) {
    const page = join(workDir, 'page.html');
    const render = join(workDir, 'render.png');
    writeFileSync(
      page,
      `<style>html,body{margin:0;background:transparent}img{display:block}</style>` +
        `<img src="file://${resolve(source)}" width="${RENDER_SIZE}" height="${RENDER_SIZE}">`
    );
    execFileSync(chrome, [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--default-background-color=00000000',
      `--window-size=${RENDER_SIZE},${RENDER_SIZE}`,
      `--screenshot=${render}`,
      `file://${page}`,
    ], { stdio: 'ignore' });

    for (const size of sizes) {
      const output = `public/icons/icon${size}.png`;
      execFileSync('magick', [render, '-filter', 'Lanczos', '-resize', `${size}x${size}`, '-strip', output]);
      console.log(`Wrote ${output}`);
    }
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
