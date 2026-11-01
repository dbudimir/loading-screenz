'use client';

import styled from 'styled-components';
import InstallButton from './InstallButton';

const Section = styled.section`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  align-items: center;
  margin-top: 14px;
  padding: 26px 28px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

const Core = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: transparent;
  animation: pulse 2.4s ease-in-out infinite;

  @keyframes pulse {
    50% {
      transform: scale(1.06);
      filter: brightness(1.25);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 640px) {
    align-items: center;
  }
`;

const Headline = styled.h2`
  font-size: clamp(32px, 6vw, 54px);
`;

const Blink = styled.span`
  animation: blink 1.1s steps(1) infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FinalCta = () => (
  <Section id="install" className="lz-screen lz-texture-space" aria-labelledby="install-title">
    <Core className="lz-glow-core" aria-hidden />
    <Copy>
      <Headline id="install-title" className="lz-display">
        Press Start
      </Headline>
      <p className="lz-heading">
        <Blink>▶</Blink> Insert link to continue.
      </p>
      <p className="lz-text">
        Free download. Installs in seconds. Your next click could be a trip to the Pillar of Autumn.
      </p>
      <div>
        <InstallButton size="large" label="Install Loading Screens" />
      </div>
    </Copy>
  </Section>
);

export default FinalCta;
