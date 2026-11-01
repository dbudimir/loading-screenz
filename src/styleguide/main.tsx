import { StrictMode, useState, type CSSProperties, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BUILT_IN_LOADERS, groupByCategory } from '../shared/loaders';
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

function tokenValue(token: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
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

function Slider({ label, value, unit, min, max, onChange, disabled }: {
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
        {label} <output className="lz-led">{value}{unit}</output>
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

function LoaderSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select className="lz-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="random">Random</option>
      {groupByCategory(BUILT_IN_LOADERS).filter(group => group.loaders.length).map(group => (
        <optgroup key={group.category} label={group.label}>
          {group.loaders.map(loader => (
            <option key={loader.id} value={loader.id}>{loader.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Tile({ path, name, children }: { path: string; name: string; children?: ReactNode }) {
  return (
    <figure className="lz-tile">
      <div className="lz-tile-frame">
        <video
          src={path}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={e => (e.currentTarget.currentTime = e.currentTarget.duration * 0.4)}
          onMouseEnter={e => e.currentTarget.play().catch(() => {})}
          onMouseLeave={e => e.currentTarget.pause()}
        />
      </div>
      <figcaption className="lz-tile-caption">{name}</figcaption>
      {children}
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
          <span className="lz-logo-word">Loading <b>Screens</b></span>
        </span>
      </header>
      <div className="lz-rail" />
      <div className="lz-screen lz-texture-space sg-popup-screen">
        <label className="lz-power">
          <input type="checkbox" role="switch" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
          <span>
            <span className="lz-heading">{enabled ? 'Powered on' : 'Powered off'}</span>
            <span className="lz-fine sg-block">Loading screens on {frequency}% of link clicks</span>
          </span>
        </label>
        <fieldset disabled={!enabled} className="sg-fieldset">
          <label className="sg-field">
            <span className="lz-heading">Loading screen</span>
            <LoaderSelect value={loader} onChange={setLoader} />
          </label>
          <Slider label="Frequency" value={frequency} unit="%" min={1} max={100} onChange={setFrequency} disabled={!enabled} />
          <Slider label="Duration" value={duration} unit="s" min={1} max={15} onChange={setDuration} disabled={!enabled} />
        </fieldset>
      </div>
      <footer className="lz-shell-foot">
        <button type="button" className="lz-button">Manage library…</button>
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
          <span className="lz-logo-word">Loading <b>Screens</b></span>
        </span>
        <span className="lz-fine">Library · 9 loading screens</span>
      </header>
      <nav className="lz-nav">
        <a href="#library" aria-current="page">Library</a>
        <a href="#library">Settings</a>
        <a href="#library">Themes</a>
        <a href="#library">About</a>
      </nav>
      <div className="lz-rail" />
      <div className="lz-screen lz-texture-space sg-library">
        <div
          className={`lz-dropzone lz-texture-grille${dragging ? ' is-dragging' : ''}`}
          onMouseEnter={() => setDragging(true)}
          onMouseLeave={() => setDragging(false)}
        >
          <p className="lz-heading">Drop video files here</p>
          <button type="button" className="lz-button lz-button--primary">Choose files</button>
          <p className="lz-fine">MP4 (H.264) and WebM work everywhere. Clips up to 15 seconds look best.</p>
        </div>

        {groupByCategory(BUILT_IN_LOADERS).filter(group => group.loaders.length).map(group => (
          <section key={group.category} className="sg-category">
            <h3 className="lz-bar">{group.label}</h3>
            <div className="sg-tiles">
              {group.loaders.map(loader => (
                <Tile key={loader.id} path={loader.builtIn ? loader.path : ''} name={loader.name}>
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
            <Tile path="media/halo.mp4" name="">
              <input className="lz-input" defaultValue="My Halo edit" aria-label="Name" />
              <span className="lz-fine sg-center">15s · 1.2 MB</span>
              <button type="button" className="lz-button lz-button--danger lz-button--small">Delete</button>
            </Tile>
          </div>
        </section>

        <div className="lz-ticker">
          <span>Storage used: 3.4 MB ··· 9 loading screens in your library ··· Tip: hover a screen to preview it ···</span>
        </div>
      </div>
      <footer className="lz-shell-foot">
        <span>Loading Screens is not affiliated with Microsoft, Sony, Nintendo, or Sega.</span>
      </footer>
    </div>
  );
}

function StyleGuide() {
  const [theme, setTheme] = useState('xbox');
  const [power, setPower] = useState(true);
  const [check, setCheck] = useState(true);
  const [range, setRange] = useState(60);

  const changeTheme = (id: string) => {
    setTheme(id);
    document.documentElement.dataset.theme = id;
  };

  return (
    <div className="sg-page">
      <div className="lz-shell">
        <header className="lz-shell-cap">
          <span className="lz-logo">
            <span className="lz-logo-orb" />
            <span className="lz-logo-word">Loading <b>Screens</b></span>
          </span>
          <label className="sg-theme">
            <span className="lz-fine">Theme</span>
            <select className="lz-select" value={theme} onChange={e => changeTheme(e.target.value)}>
              {THEMES.map(item => (
                <option key={item.id} value={item.id} disabled={!item.ready}>
                  {item.name}{item.ready ? '' : ' (planned)'}
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
                  <code className="sg-value">{tokenValue(swatch.token).startsWith('#') ? tokenValue(swatch.token) : 'gradient'}</code>
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
                <Specimen label=".lz-display (Arial Black)"><p className="lz-display">Halo 2</p></Specimen>
                <Specimen label=".lz-heading (Trebuchet MS bold italic)">
                  <p className="lz-heading">Need for Speed Underground 2:</p>
                </Specimen>
                <Specimen label=".lz-text (Verdana 11px)">
                  <p className="lz-text">We've pined. We've yearned. We've waited patiently… but no longer! It's in stores now.</p>
                </Specimen>
                <Specimen label=".lz-fine (Verdana 10px)">
                  <p className="lz-fine">©2004 Loading Screens. All rights reserved. Not affiliated with any console maker.</p>
                </Specimen>
              </div>
              <div className="sg-stack">
                <Specimen label=".lz-bar"><h3 className="lz-bar">Upcoming Games</h3></Specimen>
                <Specimen label=".lz-links inside .lz-panel">
                  <div className="lz-panel">
                    <ul className="lz-links">
                      <li><a href="#type">First Encounter</a></li>
                      <li><a href="#type">What's New in Halo 2</a></li>
                      <li><a href="#type">Dual Wielding Tips</a></li>
                    </ul>
                  </div>
                </Specimen>
                <Specimen label=".lz-links inside .lz-screen">
                  <div className="lz-screen">
                    <ul className="lz-links">
                      <li><a href="#type">NYC: Midnight Madness</a></li>
                      <li><a href="#type">Seattle: Fans Gather at Midnight</a></li>
                    </ul>
                  </div>
                </Specimen>
              </div>
            </div>
          </Section>

          <Section id="controls" title="Controls">
            <div className="sg-specimens">
              <Specimen label=".lz-button">
                <button type="button" className="lz-button">Sign In</button>
              </Specimen>
              <Specimen label=".lz-button--primary">
                <button type="button" className="lz-button lz-button--primary">Choose files</button>
              </Specimen>
              <Specimen label=".lz-button--danger">
                <button type="button" className="lz-button lz-button--danger">Delete</button>
              </Specimen>
              <Specimen label=".lz-button--small">
                <button type="button" className="lz-button lz-button--small">GO</button>
              </Specimen>
              <Specimen label=".lz-button:disabled">
                <button type="button" className="lz-button lz-button--primary" disabled>Adding…</button>
              </Specimen>
              <Specimen label=".lz-power">
                <label className="lz-power">
                  <input type="checkbox" role="switch" checked={power} onChange={e => setPower(e.target.checked)} />
                  {power ? 'On' : 'Off'}
                </label>
              </Specimen>
              <Specimen label=".lz-power (disabled)">
                <label className="lz-power">
                  <input type="checkbox" role="switch" disabled />
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
                  <Tile path="media/xbox.mp4" name="" />
                  <div>
                    <p className="lz-heading">Xbox <span className="lz-badge lz-badge--live">Live</span></p>
                    <p className="lz-text">The green core powers up. A deep-space .lz-screen with a neon heading and body text.</p>
                  </div>
                </div>
                <div className="lz-ticker"><span>.lz-ticker ··· Now loading: Halo 2 ··· Earth will never be the same ···</span></div>
              </div>
              <div className="sg-stack">
                <div className="sg-tiles">
                  <Tile path="media/halo.mp4" name="Halo 2 Video" />
                  <Tile path="media/gta-san-andreas.mp4" name="San Andreas Video" />
                </div>
                <div className="lz-dropzone lz-texture-grille">
                  <p className="lz-heading">.lz-dropzone on .lz-texture-grille</p>
                </div>
              </div>
            </div>
          </Section>

          <Section id="popup" title="Popup mockup">
            <p className="lz-text sg-note">The toolbar popup, 300px wide, restyled with the components. Everything is interactive.</p>
            <PopupMockup />
          </Section>

          <Section id="library" title="Library mockup">
            <p className="lz-text sg-note">The library page. Hover a screen to play it, and hover the drop zone for its drag state.</p>
            <LibraryMockup />
          </Section>
        </div>

        <footer className="lz-shell-foot">
          <span className="lz-logo">
            <span className="lz-logo-orb" />
            <span className="lz-logo-word">Loading <b>Screens</b></span>
          </span>
          <span>docs/design-system.md · src/theme/</span>
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleGuide />
  </StrictMode>
);
