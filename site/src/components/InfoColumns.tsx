'use client';

import styled from 'styled-components';

const FEATURES = [
  '8 legendary screens built in',
  'Upload your own clips',
  'Pick one, or go Random',
  'Frequency dial: 1 to 100% of clicks',
  'Duration: up to 15 seconds',
  'Works on any website',
];

const TRANSMISSIONS = [
  { title: 'Crash Bandicoot warps in', badge: 'New' },
  { title: 'GTA: San Andreas joins the lineup', badge: 'New' },
  { title: 'Resident Evil door now creaking', badge: null },
  { title: 'Dreamcast startup goes pure white', badge: null },
  { title: 'Upload your own loading screens', badge: 'Hot' },
  { title: 'Rebuilt for modern Chrome', badge: null },
];

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
  border: 1px solid #000;
  background:
    radial-gradient(ellipse at 20% 30%, #e0a060 0%, transparent 55%),
    radial-gradient(ellipse at 75% 70%, #8a5a30 0%, transparent 60%),
    linear-gradient(135deg, #f3c890, #b07040);

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

const InfoColumns = () => (
  <Grid id="features" aria-label="Features and news">
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
  </Grid>
);

export default InfoColumns;
