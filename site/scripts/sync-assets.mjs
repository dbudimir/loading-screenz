// Copies the extension's loading screen videos and icon into public/ so the site shows the same media the
// extension ships. The copies are gitignored; the extension's public/ folder stays the only source.
//
// The masters are AV1 video + Opus audio, which Safari (any iPhone older than the 15 Pro) cannot decode at
// all, so the site must not serve them as-is. site/media/ holds H.264 renditions and WebP poster stills
// generated from the masters, named exactly like them; copying them over the synced files swaps what the
// site serves without touching the extension's copies.

import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const extension = join(site, '..');

mkdirSync(join(site, 'public'), { recursive: true });
cpSync(join(extension, 'public/media'), join(site, 'public/media'), { recursive: true });
cpSync(join(site, 'media'), join(site, 'public/media'), { recursive: true });
cpSync(join(extension, 'public/icons/icon128.png'), join(site, 'public/icon128.png'));
console.log('Synced loading screen media and icon from the extension, with site H.264 renditions and posters');
