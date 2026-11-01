'use client';

import { type CSSProperties, useState } from 'react';
import styled from 'styled-components';
import { LOADERS } from '@/lib/loaders';

const Section = styled.section`
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  margin-top: 14px;
  padding: 18px 8px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const Popup = styled.div`
  width: 300px;
`;

const PopupScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Fields = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  border: 0;

  &:disabled {
    opacity: 0.45;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font: bold 11px var(--lz-font-body);
`;

const FieldLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--lz-chrome-text);
`;

/* The chrome lettering washes out on the light frame, so this heading uses dark steel instead. */
const Headline = styled.h2`
  font-size: clamp(24px, 3.6vw, 34px);
  background: linear-gradient(180deg, #5d7286 0%, #2a3a4a 50%, #101820 100%);
  background-clip: text;
  -webkit-text-stroke: 0;
  filter: drop-shadow(0 1px 0 rgb(255 255 255 / 0.8));
`;

const Specs = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 12px;
  margin: 0;
  font-size: var(--lz-text-sm);

  dt {
    font-weight: bold;
  }

  dd {
    margin: 0;
  }
`;

const Slider = ({
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
}) => (
  <Field>
    <FieldLabel>
      {label} <output className="lz-led">{`${value}${unit}`}</output>
    </FieldLabel>
    <input
      className="lz-range"
      type="range"
      min={min}
      max={max}
      value={value}
      style={{ '--lz-fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      onChange={e => onChange(Number(e.target.value))}
    />
  </Field>
);

const ControlPanel = () => {
  const [enabled, setEnabled] = useState(true);
  const [loader, setLoader] = useState('random');
  const [frequency, setFrequency] = useState(25);
  const [duration, setDuration] = useState(5);

  return (
    <Section id="controls" aria-labelledby="controls-title">
      <Popup className="lz-shell" aria-label="Extension popup preview">
        <div className="lz-shell-cap">
          <span className="lz-logo">
            <span className="lz-logo-orb" />
            <span className="lz-logo-word">
              Loading <b>Screens</b>
            </span>
          </span>
        </div>
        <div className="lz-rail" />
        <PopupScreen className="lz-screen lz-texture-space">
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
              <span className="lz-fine" style={{ display: 'block' }}>
                {enabled ? `Loading screens on ${frequency}% of link clicks` : 'Browse like it’s a normal day'}
              </span>
            </span>
          </label>
          <Fields disabled={!enabled}>
            <Field>
              <span className="lz-heading">Loading screen</span>
              <select className="lz-select" value={loader} onChange={e => setLoader(e.target.value)}>
                <option value="random">Random</option>
                {LOADERS.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Slider label="Frequency" value={frequency} unit="%" min={1} max={100} onChange={setFrequency} />
            <Slider label="Duration" value={duration} unit="s" min={1} max={15} onChange={setDuration} />
          </Fields>
        </PopupScreen>
      </Popup>

      <Copy>
        <span>
          <span className="lz-badge lz-badge--live">Live demo</span>
        </span>
        <Headline id="controls-title" className="lz-display">
          Your browser. Your rules.
        </Headline>
        <p className="lz-text">
          Total command from the toolbar. Flip the power, pick your screen, and dial in exactly how hardcore you want to
          go. Go ahead and try it. This panel is the real deal.
        </p>
        <Specs>
          <dt>Frequency</dt>
          <dd>From a rare surprise (1% of clicks) to every single link (100%).</dd>
          <dt>Duration</dt>
          <dd>1 to 15 seconds. Longer clips speed up to fit, shorter ones end early.</dd>
          <dt>Random</dt>
          <dd>Shuffle the whole library, and choose which screens are in the rotation.</dd>
          <dt>Your library</dt>
          <dd>Add your own videos. They're stored on your computer and never uploaded.</dd>
        </Specs>
      </Copy>
    </Section>
  );
};

export default ControlPanel;
