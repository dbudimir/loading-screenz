// Prepares the site's public/ media: H.264 renditions and WebP poster stills from site/media/, plus the
// extension's icon. The copies in public/ are gitignored.
//
// The extension's masters (../public/media) are AV1 video + Opus audio, which Safari (any iPhone older
// than the 15 Pro) cannot decode at all, so the site must not serve them. site/media/ holds the site's
// own renditions, generated from the masters and named exactly like them. Nothing here copies the
// masters — if a loader is added to the extension without renditions, this script fails the build
// rather than letting the site ship a video half its visitors cannot play.

import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const extension = join(site, '..');

const masterIds = readdirSync(join(extension, 'public/media'))
  .filter(file => file.endsWith('.mp4'))
  .map(file => file.replace(/\.mp4$/, ''));
const missing = masterIds.filter(
  id => !existsSync(join(site, 'media', `${id}.mp4`)) || !existsSync(join(site, 'media', `${id}.webp`)),
);
if (missing.length > 0) {
  throw new Error(
    `Missing site media for: ${missing.join(', ')}. ` +
      'Generate an H.264 rendition and a WebP poster still from each extension master into site/media/ first.',
  );
}

mkdirSync(join(site, 'public'), { recursive: true });
cpSync(join(site, 'media'), join(site, 'public/media'), { recursive: true });
cpSync(join(extension, 'public/icons/icon128.png'), join(site, 'public/icon128.png'));
console.log('Synced site media (H.264 renditions and posters) and the extension icon');
