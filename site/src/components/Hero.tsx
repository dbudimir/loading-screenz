'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { LOADERS } from '@/lib/loaders';
import InstallButton from './InstallButton';
import LoaderVideo from './LoaderVideo';

const Screen = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 18px;
  padding: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Monitor = styled.div`
  position: relative;
`;

const NowLoading = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
`;

const Headline = styled.h1`
  font-size: clamp(26px, 4.4vw, 40px);
  line-height: 1.02;

  em {
    background: linear-gradient(180deg, var(--lz-accent-bright) 0%, var(--lz-accent) 55%, var(--lz-accent-dark) 100%);
    background-clip: text;
    color: transparent;
    font-style: inherit;
    -webkit-text-stroke-color: var(--lz-accent-dark);
  }
`;

const Pitch = styled.p`
  max-width: 520px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  .lz-button:not(.lz-button--primary) {
    padding: 8px 18px;
    border-radius: 10px;
    font-size: 13px;
    text-decoration: none;
  }
`;

const Lineup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LineupItem = styled.button<{ $active: boolean }>`
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 10px;
  align-items: center;
  padding: 5px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--lz-accent)' : 'transparent')};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? 'rgb(140 198 63 / 0.12)' : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 0 10px var(--lz-accent-glow)' : 'none')};
  color: var(--lz-screen-text);
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: var(--lz-accent-dark);
  }

  .lz-tile-frame {
    padding: 3px 3px 6px;
  }

  .lz-tile-frame::after {
    display: none;
  }
`;

const ItemText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const FEATURED_ID = 'xbox';
const LINEUP_SIZE = 6;
const featured = LOADERS.find(loader => loader.id === FEATURED_ID) ?? LOADERS[0];
const lineup = [featured, ...LOADERS.filter(loader => loader !== featured)].slice(0, LINEUP_SIZE);

const Hero = () => {
  const [selected, setSelected] = useState(featured);

  return (
    <Screen id="top" className="lz-screen lz-texture-space">
      <Feature>
        <Monitor className="lz-tile-frame">
          <NowLoading className="lz-led">NOW LOADING: {selected.name.toUpperCase()}</NowLoading>
          <LoaderVideo id={selected.id} name={selected.name} autoPlay />
        </Monitor>
        <Headline className="lz-display">
          Browsing the web <em>slower</em> than ever!
        </Headline>
        <Pitch className="lz-text">
          <strong className="lz-heading">Every click is a loading screen...</strong> We've pined. We've yearned. We've
          stared at blank white pages waiting for the web to load. No longer! The greatest boot-ups and loading screens
          in gaming history now play right in your browser, every time you click a link. The web will never be the same.
        </Pitch>
        <Actions>
          <InstallButton size="large" label="Install Free for Chrome" />
          <a className="lz-button" href="#screens">
            See the screens
          </a>
        </Actions>
        <p className="lz-fine">Also works in Edge, Brave, Arc, Opera, and Vivaldi. Chrome 120 or newer.</p>
      </Feature>

      <Lineup aria-label="The lineup">
        <p className="lz-heading">
          The lineup <span className="lz-badge lz-badge--hot">Hot</span>
        </p>
        {lineup.map(loader => (
          <LineupItem
            key={loader.id}
            type="button"
            $active={loader.id === selected.id}
            aria-pressed={loader.id === selected.id}
            onClick={() => setSelected(loader)}
          >
            <span className="lz-tile-frame">
              <LoaderVideo id={loader.id} name={loader.name} />
            </span>
            <ItemText>
              <span className="lz-heading">{loader.name}:</span>
              <span className="lz-fine">{loader.blurb}</span>
            </ItemText>
          </LineupItem>
        ))}
        <a className="lz-fine" href="#screens">
          + {LOADERS.length - lineup.length} more in the gallery
        </a>
      </Lineup>
    </Screen>
  );
};

export default Hero;
