import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getLibrary, groupByCategory, type Loader } from '../shared/loaders';
import { getSettings, RANDOM_LOADER, saveSettings, type Settings } from '../shared/settings';
import './popup.css';

// chrome.storage.sync limits writes per minute, so slider drags are debounced.
const SAVE_DELAY_MS = 250;

function Popup() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [library, setLibrary] = useState<Loader[]>([]);

  useEffect(() => {
    getSettings().then(setSettings);
    getLibrary().then(setLibrary);
  }, []);

  useEffect(() => {
    if (!settings) return;
    const { enabled, loader, frequency, duration } = settings;
    const timer = setTimeout(() => saveSettings({ enabled, loader, frequency, duration }), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [settings]);

  if (!settings) return null;

  const update = (patch: Partial<Settings>) => setSettings({ ...settings, ...patch });

  return (
    <main>
      <header>
        <h1>Loading Screens</h1>
        <p>Classic loading screens while you browse.</p>
      </header>

      <label className="toggle">
        <span>Enabled</span>
        <input type="checkbox" checked={settings.enabled} onChange={e => update({ enabled: e.target.checked })} />
      </label>

      <fieldset disabled={!settings.enabled}>
        <label className="select">
          <span>Loading screen</span>
          <select value={settings.loader} onChange={e => update({ loader: e.target.value })}>
            <option value={RANDOM_LOADER}>Random</option>
            {groupByCategory(library)
              .filter(group => group.loaders.length > 0)
              .map(group => (
                <optgroup key={group.category} label={group.label}>
                  {group.loaders.map(loader => (
                    <option key={loader.id} value={loader.id}>
                      {loader.name}
                    </option>
                  ))}
                </optgroup>
              ))}
          </select>
        </label>

        <label className="slider">
          <span>
            Frequency <output>{settings.frequency}% of link clicks</output>
          </span>
          <input
            type="range"
            min={1}
            max={100}
            value={settings.frequency}
            onChange={e => update({ frequency: e.target.valueAsNumber })}
          />
        </label>

        <label className="slider">
          <span>
            Duration <output>{settings.duration}s</output>
          </span>
          <input
            type="range"
            min={1}
            max={15}
            value={settings.duration}
            onChange={e => update({ duration: e.target.valueAsNumber })}
          />
        </label>
      </fieldset>

      <button type="button" className="manage" onClick={() => chrome.runtime.openOptionsPage()}>
        Manage library…
      </button>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
