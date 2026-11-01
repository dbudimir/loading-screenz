'use client';

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { LOADERS, loaderSrc } from '@/lib/loaders';
import { FLAT_LOGOS, type LogoOption, ORB_LOGOS } from './logos';
import './styleguide.css';

const THEMES = [
  { id: 'xbox', name: 'Xbox', ready: true },
  { id: 'ps2', name: 'PlayStation 2', ready: false },
  { id: 'dreamcast', name: 'Dreamcast', ready: false },
  { id: 'gamecube', name: 'GameCube', ready: false },
];

const SECTIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'textures', label: 'Textures' },
  { id: 'type', label: 'Type' },
  { id: 'controls', label: 'Controls' },
  { id: 'panels', label: 'Panels' },
  { id: 'popup', label: 'Popup' },
  { id: 'library', label: 'Library' },
  { id: 'logos', label: 'Logos' },
];

const SWATCHES = [
  { token: '--lz-accent', name: 'Lime' },
  { token: '--lz-accent-bright', name: 'Lime bright' },
  { token: '--lz-accent-dark', name: 'Lime dark' },
  { token: '--lz-heading', name: 'Neon heading' },
  { token: '--lz-danger', name: 'Hot orange' },
  { token: '--lz-led-text', name: 'LED' },
  { token: '--lz-chrome', name: 'Chrome' },
  { token: '--lz-screen-bg', name: 'Deep space' },
  { token: '--lz-nav-bg', name: 'Nav' },
  { token: '--lz-nav-active-bg', name: 'Nav active' },
  { token: '--lz-bar-bg', name: 'Section bar' },
  { token: '--lz-tile-frame', name: 'Monitor glass' },
  { token: '--lz-panel-bg', name: 'Tinted panel' },
  { token: '--lz-page-bg', name: 'Page' },
];

const TEXTURES = ['brushed', 'grille', 'carbon', 'plastic', 'space'];

const CATEGORIES = [
  { category: 'game', label: 'Game loading screens' },
  { category: 'console', label: 'Console startups' },
] as const;

const LOADER_GROUPS = CATEGORIES.map(({ category, label }) => ({
  category,
  label,
  loaders: LOADERS.filter(loader => loader.category === category),
}));

/** Resolved token values. Only readable in the browser, so they're read after mount and on theme changes. */
function readTokenValues(): Record<string, string> {
  const styles = getComputedStyle(document.documentElement);
  return Object.fromEntries(SWATCHES.map(({ token }) => [token, styles.getPropertyValue(token).trim()]));
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="sg-section">
      <h2 className="lz-bar">{title}</h2>
      <div className="sg-section-body">{children}</div>
    </section>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="sg-specimen">
      <div className="sg-specimen-demo">{children}</div>
      <code>{label}</code>
    </div>
  );
}

function Slider({
  label,
  value,
  unit,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="sg-slider">
      <span>
        {label}{' '}
        <output className="lz-led">
          {value}
          {unit}
        </output>
      </span>
      <input
        className="lz-range"
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        style={{ '--lz-fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
        onChange={e => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function LoaderSelect({ id, value, onChange }: { id?: string; value: string; onChange: (value: string) => void }) {
  return (
    <select id={id} className="lz-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="random">Random</option>
      {LOADER_GROUPS.map(group => (
        <optgroup key={group.category} label={group.label}>
          {group.loaders.map(loader => (
            <option key={loader.id} value={loader.id}>
              {loader.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Tile({ id, name, children }: { id: string; name: string; children?: ReactNode }) {
  return (
    <figure className="lz-tile">
      <div className="lz-tile-frame">
        <video
          src={loaderSrc(id)}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={e => {
            e.currentTarget.currentTime = e.currentTarget.duration * 0.4;
          }}
          onMouseEnter={e => e.currentTarget.play().catch(() => {})}
          onMouseLeave={e => e.currentTarget.pause()}
        />
      </div>
      <figcaption className="lz-tile-caption">{name}</figcaption>
      {children}
    </figure>
  );
}

function OrbLogoCard({ logo }: { logo: LogoOption }) {
  return (
    <figure className="sg-logo-card">
      <div className="lz-screen lz-texture-space sg-logo-stage">
        <logo.Mark size={128} />
      </div>
      <div className="sg-logo-lockup">
        <span className="lz-logo">
          <logo.Mark size={26} />
          <span className="lz-logo-word lz-logo-word--stacked">
            Loading <b>Screenz</b>
          </span>
        </span>
      </div>
      <figcaption className="sg-logo-caption">
        <span className="lz-heading">
          {logo.letter} · {logo.name} {logo.inUse && <span className="lz-badge lz-badge--live">In use</span>}
        </span>
        <span className="lz-fine">{logo.note}</span>
      </figcaption>
    </figure>
  );
}

function FlatLogoCard({ logo }: { logo: LogoOption }) {
  return (
    <figure className="sg-logo-card">
      <div className="sg-logo-pair">
        <div className="sg-logo-light">
          <logo.Mark size={72} />
        </div>
        <div className="sg-logo-dark">
          <logo.Mark size={72} />
        </div>
      </div>
      <div className="sg-logo-sizes">
        {[48, 32, 16].map(size => (
          <span key={size}>
            <logo.Mark size={size} />
            <code>{size}</code>
          </span>
        ))}
      </div>
      {['light', 'dark'].map(mode => (
        <div key={mode} className={`sg-browser sg-browser--${mode}`}>
          <span className="sg-browser-tab">
            <logo.Mark size={16} />
            Loading Screenz
          </span>
          <span className="sg-browser-toolbar">
            <span className="sg-browser-dot" />
            <span className="sg-browser-dot" />
            <logo.Mark size={16} />
            <span className="sg-browser-dot" />
          </span>
        </div>
      ))}
      <figcaption className="sg-logo-caption">
        <span className="lz-heading">
          {logo.letter} · {logo.name} {logo.inUse && <span className="lz-badge lz-badge--live">In use</span>}
        </span>
        <span className="lz-fine">{logo.note}</span>
      </figcaption>
    </figure>
  );
}

function PopupMockup() {
  const [enabled, setEnabled] = useState(true);
  const [loader, setLoader] = useState('random');
  const [frequency, setFrequency] = useState(25);
  const [duration, setDuration] = useState(5);

  return (
    <div className="sg-popup lz-shell">
      <header className="lz-shell-cap">
        <span className="lz-logo">
          <span className="lz-logo-orb" />
          <span className="lz-logo-word lz-logo-word--stacked">
            Loading <b>Screenz</b>
          </span>
        </span>
      </header>
      <div className="lz-rail" />
      <div className="lz-screen lz-texture-space sg-popup-screen">
        <label className="lz-power">
          <input
            type="checkbox"
            role="switch"
            aria-checked={enabled}
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
          <span>
            <span className="lz-heading">{enabled ? 'Powered on' : 'Powered off'}</span>
            <span className="lz-fine sg-block">Loading screens on {frequency}% of link clicks</span>
          </span>
        </label>
        <fieldset disabled={!enabled} className="sg-fieldset">
          <div className="sg-field">
            <label htmlFor="sg-popup-loader" className="lz-heading">
              Loading screen
            </label>
            <LoaderSelect id="sg-popup-loader" value={loader} onChange={setLoader} />
          </div>
          <Slider
            label="Frequency"
            value={frequency}
            unit="%"
            min={1}
            max={100}
            onChange={setFrequency}
            disabled={!enabled}
          />
          <Slider
            label="Duration"
            value={duration}
            unit="s"
            min={1}
            max={15}
            onChange={setDuration}
            disabled={!enabled}
          />
        </fieldset>
      </div>
      <footer className="lz-shell-foot">
        <button type="button" className="lz-button">
          Manage library…
        </button>
        <span className="lz-badge lz-badge--live">Live</span>
      </footer>
    </div>
  );
}

function LibraryMockup() {
  const [dragging, setDragging] = useState(false);
  const [excluded, setExcluded] = useState<string[]>(['dreamcast']);
  const toggle = (id: string, include: boolean) =>
    setExcluded(current => (include ? current.filter(item => item !== id) : [...current, id]));

  return (
    <div className="lz-shell">
      <header className="lz-shell-cap">
        <span className="lz-logo">
          <span className="lz-logo-orb" />
          <span className="lz-logo-word">
            Loading <b>Screenz</b>
          </span>
        </span>
        <span className="lz-fine">Library · 9 loading screens</span>
      </header>
      <nav className="lz-nav">
        <a href="#library" aria-current="page">
          Library
        </a>
        <a href="#library">Settings</a>
        <a href="#library">Themes</a>
        <a href="#library">About</a>
      </nav>
      <div className="lz-rail" />
      <div className="lz-screen lz-texture-space sg-library">
        {/* biome-ignore lint/a11y/noStaticElementInteractions: hover only previews the drag state */}
        <div
          className={`lz-dropzone lz-texture-grille${dragging ? ' is-dragging' : ''}`}
          onMouseEnter={() => setDragging(true)}
          onMouseLeave={() => setDragging(false)}
        >
          <p className="lz-heading">Drop video files here</p>
          <button type="button" className="lz-button lz-button--primary">
            Choose files
          </button>
          <p className="lz-fine">MP4 (H.264) and WebM work everywhere. Clips up to 15 seconds look best.</p>
        </div>

        {LOADER_GROUPS.map(group => (
          <section key={group.category} className="sg-category">
            <h3 className="lz-bar">{group.label}</h3>
            <div className="sg-tiles">
              {group.loaders.map(loader => (
                <Tile key={loader.id} id={loader.id} name={loader.name}>
                  <label className="lz-check sg-tile-check">
                    <input
                      type="checkbox"
                      checked={!excluded.includes(loader.id)}
                      onChange={e => toggle(loader.id, e.target.checked)}
                    />
                    In rotation
                  </label>
                </Tile>
              ))}
            </div>
          </section>
        ))}

        <section className="sg-category">
          <h3 className="lz-bar">Your videos</h3>
          <div className="sg-tiles">
            <Tile id="halo" name="">
              <input className="lz-input" defaultValue="My Halo edit" aria-label="Name" />
              <span className="lz-fine sg-center">15s · 1.2 MB</span>
              <button type="button" className="lz-button lz-button--danger lz-button--small">
                Delete
              </button>
            </Tile>
          </div>
        </section>

        <div className="lz-ticker">
          <span>
            Storage used: 3.4 MB ··· 9 loading screens in your library ··· Tip: hover a screen to preview it ···
          </span>
        </div>
      </div>
      <footer className="lz-shell-foot">
        <span>Loading Screenz is not affiliated with Microsoft, Sony, Nintendo, or Sega.</span>
      </footer>
    </div>
  );
}

export default function StyleGuide() {
  const [theme, setTheme] = useState('xbox');
  const [power, setPower] = useState(true);
  const [check, setCheck] = useState(true);
  const [range, setRange] = useState(60);
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({});

  useEffect(() => setTokenValues(readTokenValues()), []);

  const changeTheme = (id: string) => {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    setTokenValues(readTokenValues());
  };

  return (
    <div className="sg-page">
      <div className="lz-shell">
        <header className="lz-shell-cap">
          <span className="lz-logo">
            <span className="lz-logo-orb" />
            <span className="lz-logo-word">
              Loading <b>Screenz</b>
            </span>
          </span>
          <label className="sg-theme">
            <span className="lz-fine">Theme</span>
            <select className="lz-select" value={theme} onChange={e => changeTheme(e.target.value)}>
              {THEMES.map(item => (
                <option key={item.id} value={item.id} disabled={!item.ready}>
                  {item.name}
                  {item.ready ? '' : ' (planned)'}
                </option>
              ))}
            </select>
          </label>
        </header>
        <nav className="lz-nav">
          {SECTIONS.map((section, index) => (
            <a key={section.id} href={`#${section.id}`} aria-current={index === 0 ? 'page' : undefined}>
              {section.label}
            </a>
          ))}
        </nav>
        <div className="lz-rail" />

        <div className="lz-screen lz-texture-space sg-hero">
          <div>
            <h1 className="lz-display">Design system</h1>
            <p className="lz-text sg-hero-text">
              Early-2000s console web design: chrome frames, deep-space screens, beveled plastic, and neon highlights.
              Every component reads theme tokens, so each console theme reuses them. Hover and click anything.
            </p>
          </div>
          <div className="lz-glow-core sg-core" />
        </div>

        <div className="sg-sections">
          <Section id="colors" title="Colors">
            <div className="sg-swatches">
              {SWATCHES.map(swatch => (
                <div key={swatch.token} className="sg-swatch">
                  <div className="sg-swatch-chip" style={{ background: `var(${swatch.token})` }} />
                  <strong>{swatch.name}</strong>
                  <code>{swatch.token}</code>
                  <code className="sg-value">
                    {tokenValues[swatch.token]?.startsWith('#') ? tokenValues[swatch.token] : 'gradient'}
                  </code>
                </div>
              ))}
            </div>
          </Section>

          <Section id="textures" title="Textures">
            <div className="sg-swatches">
              {TEXTURES.map(texture => (
                <div key={texture} className="sg-swatch">
                  <div className={`sg-texture ${texture === 'plastic' ? 'sg-texture-backdrop' : ''}`}>
                    <div className={`lz-texture-${texture} sg-texture-fill`} />
                  </div>
                  <code>.lz-texture-{texture}</code>
                </div>
              ))}
              <div className="sg-swatch">
                <div className="sg-texture lz-glow-core" />
                <code>.lz-glow-core</code>
              </div>
            </div>
          </Section>

          <Section id="type" title="Type">
            <div className="sg-grid-2">
              <div className="lz-screen lz-texture-space sg-stack">
                <Specimen label=".lz-display (Arial Black)">
                  <p className="lz-display">Halo 2</p>
                </Specimen>
                <Specimen label=".lz-heading (Trebuchet MS bold italic)">
                  <p className="lz-heading">Need for Speed Underground 2:</p>
                </Specimen>
                <Specimen label=".lz-text (Verdana 11px)">
                  <p className="lz-text">
                    We've pined. We've yearned. We've waited patiently… but no longer! It's in stores now.
                  </p>
                </Specimen>
                <Specimen label=".lz-fine (Verdana 10px)">
                  <p className="lz-fine">
                    ©2004 Loading Screenz. All rights reserved. Not affiliated with any console maker.
                  </p>
                </Specimen>
              </div>
              <div className="sg-stack">
                <Specimen label=".lz-bar">
                  <h3 className="lz-bar">Upcoming Games</h3>
                </Specimen>
                <Specimen label=".lz-links inside .lz-panel">
                  <div className="lz-panel">
                    <ul className="lz-links">
                      <li>
                        <a href="#type">First Encounter</a>
                      </li>
                      <li>
                        <a href="#type">What's New in Halo 2</a>
                      </li>
                      <li>
                        <a href="#type">Dual Wielding Tips</a>
                      </li>
                    </ul>
                  </div>
                </Specimen>
                <Specimen label=".lz-links inside .lz-screen">
                  <div className="lz-screen">
                    <ul className="lz-links">
                      <li>
                        <a href="#type">NYC: Midnight Madness</a>
                      </li>
                      <li>
                        <a href="#type">Seattle: Fans Gather at Midnight</a>
                      </li>
                    </ul>
                  </div>
                </Specimen>
              </div>
            </div>
          </Section>

          <Section id="controls" title="Controls">
            <div className="sg-specimens">
              <Specimen label=".lz-button">
                <button type="button" className="lz-button">
                  Sign In
                </button>
              </Specimen>
              <Specimen label=".lz-button--primary">
                <button type="button" className="lz-button lz-button--primary">
                  Choose files
                </button>
              </Specimen>
              <Specimen label=".lz-button--danger">
                <button type="button" className="lz-button lz-button--danger">
                  Delete
                </button>
              </Specimen>
              <Specimen label=".lz-button--small">
                <button type="button" className="lz-button lz-button--small">
                  GO
                </button>
              </Specimen>
              <Specimen label=".lz-button:disabled">
                <button type="button" className="lz-button lz-button--primary" disabled>
                  Adding…
                </button>
              </Specimen>
              <Specimen label=".lz-power">
                <label className="lz-power">
                  <input
                    type="checkbox"
                    role="switch"
                    aria-checked={power}
                    checked={power}
                    onChange={e => setPower(e.target.checked)}
                  />
                  {power ? 'On' : 'Off'}
                </label>
              </Specimen>
              <Specimen label=".lz-power (disabled)">
                <label className="lz-power">
                  <input type="checkbox" role="switch" aria-checked={false} disabled />
                  Off
                </label>
              </Specimen>
              <Specimen label=".lz-check">
                <label className="lz-check">
                  <input type="checkbox" checked={check} onChange={e => setCheck(e.target.checked)} />
                  In Random rotation
                </label>
              </Specimen>
              <Specimen label=".lz-select">
                <LoaderSelect value="halo" onChange={() => {}} />
              </Specimen>
              <Specimen label=".lz-input">
                <input className="lz-input" placeholder="Search" />
              </Specimen>
              <Specimen label=".lz-range + .lz-led">
                <Slider label="Frequency" value={range} unit="%" min={1} max={100} onChange={setRange} />
              </Specimen>
              <Specimen label=".lz-badge variants">
                <span className="sg-row">
                  <span className="lz-badge">Built-in</span>
                  <span className="lz-badge lz-badge--live">Live</span>
                  <span className="lz-badge lz-badge--hot">Hot</span>
                  <span className="lz-badge lz-badge--new">New</span>
                </span>
              </Specimen>
            </div>
          </Section>

          <Section id="panels" title="Panels">
            <div className="sg-grid-2">
              <div className="lz-screen lz-texture-space sg-stack">
                <div className="sg-feature">
                  <Tile id="xbox" name="" />
                  <div>
                    <p className="lz-heading">
                      Xbox <span className="lz-badge lz-badge--live">Live</span>
                    </p>
                    <p className="lz-text">
                      The green core powers up. A deep-space .lz-screen with a neon heading and body text.
                    </p>
                  </div>
                </div>
                <div className="lz-ticker">
                  <span>.lz-ticker ··· Now loading: Halo 2 ··· Earth will never be the same ···</span>
                </div>
              </div>
              <div className="sg-stack">
                <div className="sg-tiles">
                  <Tile id="halo" name="Halo 2 Video" />
                  <Tile id="gta-san-andreas" name="San Andreas Video" />
                </div>
                <div className="lz-dropzone lz-texture-grille">
                  <p className="lz-heading">.lz-dropzone on .lz-texture-grille</p>
                </div>
              </div>
            </div>
          </Section>

          <Section id="popup" title="Popup mockup">
            <p className="lz-text sg-note">
              The toolbar popup, 300px wide, restyled with the components. Everything is interactive.
            </p>
            <PopupMockup />
          </Section>

          <Section id="library" title="Library mockup">
            <p className="lz-text sg-note">
              The library page. Hover a screen to play it, and hover the drop zone for its drag state.
            </p>
            <LibraryMockup />
          </Section>

          <Section id="logos" title="Logo marks">
            <p className="lz-text sg-note">
              Round orb marks for the logo, and flat icons for the favicon and extension toolbar icon. Each flat icon
              shares a letter with an orb. A (Power Core) and B (Flat Jewel) are in use; the rest are kept for
              reference. Hover a mark to see it animate.
            </p>
            <h3 className="lz-heading sg-subhead">Orb marks</h3>
            <div className="sg-logo-grid">
              {ORB_LOGOS.map(logo => (
                <OrbLogoCard key={logo.letter} logo={logo} />
              ))}
            </div>
            <h3 className="lz-heading sg-subhead">Flat icons</h3>
            <div className="sg-logo-grid">
              {FLAT_LOGOS.map(logo => (
                <FlatLogoCard key={logo.letter} logo={logo} />
              ))}
            </div>
          </Section>
        </div>

        <footer className="lz-shell-foot">
          <span className="lz-logo">
            <span className="lz-logo-orb" />
            <span className="lz-logo-word">
              Loading <b>Screenz</b>
            </span>
          </span>
          <span>docs/design-system.md · src/theme/</span>
        </footer>
      </div>
    </div>
  );
}
