'use client';

import styled from 'styled-components';
import LoaderVideo from './LoaderVideo';

const FEATURES = [
  '8 legendary screens built in',
  'Upload your own clips',
  'Pick one, or go Random',
  'Frequency dial: 1 to 100% of clicks',
  'Duration: up to 15 seconds',
  'Works on any website',
];

const STEPS = [
  { title: 'Install it', text: 'Free from the store in one click.' },
  { title: 'Browse like normal', text: 'Click any link, anywhere on the web.' },
  { title: 'Boom. Loading screen.', text: 'Fullscreen, with sound, for a few seconds.' },
  { title: 'Page loads', text: "It's 2003 again and you didn't even need a memory card." },
];

const TRANSMISSIONS = [
  { title: 'Crash Bandicoot warps in', badge: 'New' },
  { title: 'GTA: San Andreas joins the lineup', badge: 'New' },
  { title: 'Resident Evil door now creaking', badge: null },
  { title: 'Dreamcast startup goes pure white', badge: null },
  { title: 'Upload your own loading screens', badge: 'Hot' },
  { title: 'Rebuilt for modern Chrome', badge: null },
];

const VIDEOS = [
  { id: 'xbox', name: 'Xbox Video' },
  { id: 'ps2', name: 'PlayStation 2 Video' },
  { id: 'crash-bandicoot', name: 'Crash Video' },
];

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) 170px;
  margin-top: 14px;
  border: 1px solid #000;
  background:
    radial-gradient(ellipse at 20% 30%, #e0a060 0%, transparent 55%),
    radial-gradient(ellipse at 75% 70%, #8a5a30 0%, transparent 60%),
    linear-gradient(135deg, #f3c890, #b07040);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--lz-panel-border);

  &:last-child {
    border-right: 0;
  }

  .lz-panel {
    flex: 1;
    border: 0;
  }
`;

const Steps = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;

  li {
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 8px;
    counter-increment: step;
  }

  li::before {
    content: counter(step);
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: 1px solid var(--lz-button-primary-edge);
    border-radius: 50%;
    background: var(--lz-button-primary-bg);
    color: #fff;
    font: bold 11px var(--lz-font-body);
    box-shadow: var(--lz-bevel-raised);
  }
`;

const StepTitle = styled.strong`
  display: block;
  color: var(--lz-panel-link);
  font: bold 11px var(--lz-font-body);
`;

const Videos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #fff;

  @media (max-width: 900px) {
    flex-direction: row;
    grid-column: 1 / -1;

    figure {
      flex: 1;
    }
  }
`;

const InfoColumns = () => (
  <Grid id="features" aria-label="Features, how it works, and news">
    <Column>
      <h2 className="lz-bar">Hot Features</h2>
      <div className="lz-panel">
        <ul className="lz-links">
          {FEATURES.map(feature => (
            <li key={feature}>
              <a href="#controls">{feature}</a>
            </li>
          ))}
        </ul>
      </div>
    </Column>
    <Column>
      <h2 className="lz-bar">How It Works</h2>
      <div className="lz-panel">
        <Steps>
          {STEPS.map(step => (
            <li key={step.title}>
              <span className="lz-text">
                <StepTitle>{step.title}</StepTitle>
                {step.text}
              </span>
            </li>
          ))}
        </Steps>
      </div>
    </Column>
    <Column>
      <h2 className="lz-bar">Incoming Transmissions</h2>
      <div className="lz-panel">
        <ul className="lz-links">
          {TRANSMISSIONS.map(item => (
            <li key={item.title}>
              <a href="#screens">{item.title}</a>{' '}
              {item.badge && (
                <span className={`lz-badge ${item.badge === 'Hot' ? 'lz-badge--hot' : 'lz-badge--new'}`}>
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Column>
    <Videos>
      {VIDEOS.map(video => (
        <figure key={video.id} className="lz-tile">
          <div className="lz-tile-frame">
            <LoaderVideo id={video.id} name={video.name} />
          </div>
          <figcaption className="lz-tile-caption">{video.name}</figcaption>
        </figure>
      ))}
    </Videos>
  </Grid>
);

export default InfoColumns;
