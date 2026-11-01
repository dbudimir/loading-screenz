import { type CSSProperties, StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getLibrary, groupByCategory, type Loader } from '../shared/loaders';
import { getSettings, RANDOM_LOADER, saveSettings, type Settings } from '../shared/settings';
import './popup.css';

// chrome.storage.sync limits writes per minute, so slider drags are debounced.
const SAVE_DELAY_MS = 250;

function Slider({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">
        <span className="lz-heading">{label}</span>
        <output className="lz-led">{`${value}${unit}`}</output>
      </span>
      <input
        className="lz-range"
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ '--lz-fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
        onChange={e => onChange(e.target.valueAsNumber)}
      />
    </label>
  );
}

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
    <div className="lz-shell">
      <header className="lz-shell-cap">
        <h1 className="lz-logo">
          <span className="lz-logo-orb" />
          <span className="lz-logo-word lz-logo-word--stacked">
            Loading <b>Screenz</b>
          </span>
        </h1>
      </header>
      <div className="lz-rail" />

      <main className="lz-screen lz-texture-space screen">
        <label className="lz-power">
          <input
            type="checkbox"
            role="switch"
            aria-checked={settings.enabled}
            checked={settings.enabled}
            onChange={e => update({ enabled: e.target.checked })}
          />
          <span>
            <span className="lz-heading">{settings.enabled ? 'Powered on' : 'Powered off'}</span>
            <span className="lz-fine power-status">
              {settings.enabled
                ? `Loading screens on ${settings.frequency}% of link clicks`
                : 'Browse like it’s a normal day'}
            </span>
          </span>
        </label>

        <fieldset disabled={!settings.enabled}>
          <label className="field">
            <span className="lz-heading">Loading screen</span>
            <select
              className="lz-select"
              value={settings.loader}
              onChange={e => update({ loader: e.target.value })}
            >
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

          <Slider
            label="Frequency"
            value={settings.frequency}
            unit="%"
            min={1}
            max={100}
            onChange={frequency => update({ frequency })}
          />
          <Slider
            label="Duration"
            value={settings.duration}
            unit="s"
            min={1}
            max={15}
            onChange={duration => update({ duration })}
          />
        </fieldset>
      </main>

      <footer className="lz-shell-foot">
        <button type="button" className="lz-button" onClick={() => chrome.runtime.openOptionsPage()}>
          Manage library…
        </button>
        {settings.enabled && <span className="lz-badge lz-badge--live">Live</span>}
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
