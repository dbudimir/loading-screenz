import type { Settings } from './settings';
import { getUserVideo, listUserVideos } from './user-videos';

export type LoaderCategory = 'game' | 'console' | 'user';

export type Loader =
  | {
      id: string;
      name: string;
      builtIn: true;
      category: 'game' | 'console';
      path: string;
      /** Darkens the edges of the screen. Defaults to true; turn off for videos with light backgrounds. */
      vignette?: boolean;
    }
  | { id: string; name: string; builtIn: false; category: 'user'; duration: number | null; size: number };

/** Videos that ship with the extension. Paths are relative to the extension root (`public/`). */
export const BUILT_IN_LOADERS: Loader[] = [
  { id: 'halo', name: 'Halo', builtIn: true, category: 'game', path: 'media/halo.mp4' },
  { id: 'resident-evil', name: 'Resident Evil', builtIn: true, category: 'game', path: 'media/resident-evil.mp4' },
  {
    id: 'gta-san-andreas',
    name: 'GTA: San Andreas',
    builtIn: true,
    category: 'game',
    path: 'media/gta-san-andreas.mp4',
  },
  {
    id: 'crash-bandicoot',
    name: 'Crash Bandicoot',
    builtIn: true,
    category: 'game',
    path: 'media/crash-bandicoot.mp4',
  },
  { id: 'ps2', name: 'PlayStation 2', builtIn: true, category: 'console', path: 'media/ps2.mp4' },
  { id: 'gamecube', name: 'GameCube', builtIn: true, category: 'console', path: 'media/gamecube.mp4' },
  { id: 'xbox', name: 'Xbox', builtIn: true, category: 'console', path: 'media/xbox.mp4' },
  {
    id: 'dreamcast',
    name: 'Dreamcast',
    builtIn: true,
    category: 'console',
    path: 'media/dreamcast.mp4',
    vignette: false,
  },
];

const CATEGORIES: { category: LoaderCategory; label: string }[] = [
  { category: 'game', label: 'Game loading screens' },
  { category: 'console', label: 'Console startups' },
  { category: 'user', label: 'Your videos' },
];

/** Splits the library into labeled categories, in display order. Categories can be empty. */
export function groupByCategory(library: Loader[]) {
  return CATEGORIES.map(({ category, label }) => ({
    category,
    label,
    loaders: library.filter(loader => loader.category === category),
  }));
}

/** Built-in loaders plus the user's uploaded videos. Only works in extension pages, not content scripts. */
export async function getLibrary(): Promise<Loader[]> {
  const userVideos = await listUserVideos();
  return [
    ...BUILT_IN_LOADERS,
    ...userVideos.map(video => ({
      id: video.id,
      name: video.name,
      builtIn: false as const,
      category: 'user' as const,
      duration: video.duration,
      size: video.blob.size,
    })),
  ];
}

export function pickLoader(library: Loader[], settings: Settings): Loader | undefined {
  const selected = library.find(loader => loader.id === settings.loader);
  if (selected) return selected;

  const pool = library.filter(loader => !settings.excludedFromRandom.includes(loader.id));
  const candidates = pool.length ? pool : library;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Returns a playable URL. For uploaded videos this is a blob: URL the caller should revoke when done. */
export async function getLoaderUrl(loader: Loader): Promise<string | null> {
  if (loader.builtIn) return chrome.runtime.getURL(loader.path);
  const video = await getUserVideo(loader.id);
  return video ? URL.createObjectURL(video.blob) : null;
}
