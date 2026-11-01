'use client';

import styled from 'styled-components';
import { LOADERS } from '@/lib/loaders';
import LoaderVideo from './LoaderVideo';

const GROUPS = [
  { category: 'game', title: 'Game Loading Screens' },
  { category: 'console', title: 'Console Startups' },
] as const;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
`;

const Intro = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 10px;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Blurb = styled.p`
  text-align: center;
`;

const ScreenGallery = () => (
  <Section id="screens" className="lz-screen lz-texture-space" aria-labelledby="screens-title">
    <Intro>
      <h2 id="screens-title" className="lz-display">
        The Screens
      </h2>
      <p className="lz-fine">Hover a screen to preview it. Every one ships with the extension, free.</p>
    </Intro>
    {GROUPS.map(group => (
      <div key={group.category}>
        <h3 className="lz-bar">{group.title}</h3>
        <Tiles>
          {LOADERS.filter(loader => loader.category === group.category).map(loader => (
            <figure key={loader.id} className="lz-tile">
              <div className="lz-tile-frame">
                <LoaderVideo id={loader.id} name={loader.name} />
              </div>
              <figcaption className="lz-tile-caption">{loader.name}</figcaption>
              <Blurb className="lz-fine">{loader.blurb}</Blurb>
            </figure>
          ))}
        </Tiles>
      </div>
    ))}
    <p className="lz-text">
      <span className="lz-badge">Bonus</span> Got your own favorite? Drop any MP4 or WebM into your library and it joins
      the rotation.
    </p>
  </Section>
);

export default ScreenGallery;
