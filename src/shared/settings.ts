export const RANDOM_LOADER = 'random';

export interface Settings {
  enabled: boolean;
  /** A loader id from the library, or RANDOM_LOADER. */
  loader: string;
  /** Loader ids left out when picking at random. */
  excludedFromRandom: string[];
  /** Percent chance (1-100) that a link click shows the loading screen. */
  frequency: number;
  /** Maximum seconds (1-15) the loading screen stays up. Videos shorter than this end it early. */
  duration: number;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  loader: RANDOM_LOADER,
  excludedFromRandom: [],
  frequency: 25,
  duration: 5,
};

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.sync.get<Settings>(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSettings(settings: Partial<Settings>): Promise<void> {
  return chrome.storage.sync.set(settings);
}

/** Calls `callback` whenever settings change in any context. Returns a function that stops listening. */
export function onSettingsChanged(callback: () => void): () => void {
  const listener = (_changes: unknown, areaName: string) => {
    if (areaName === 'sync') callback();
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
