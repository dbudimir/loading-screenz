'use client';

import styled from 'styled-components';
import HackerInstall from './HackerInstall';
import InstallButton from './InstallButton';

const Section = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  gap: 24px;
  align-items: center;
  margin-top: 14px;
  padding: 26px 28px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    padding: 22px 16px;
    text-align: center;
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

const FinalCta = () => (
  <Section id="install" className="lz-screen lz-texture-space" aria-labelledby="install-title">
    <Copy>
      <Headline id="install-title" className="lz-display">
        Press Start
      </Headline>
      <p className="lz-text">
        Free download. Installs in seconds. Your next click could be a trip to the Pillar of Autumn.
      </p>
      <div>
        <InstallButton size="large" label="Install Loading Screenz" />
      </div>
    </Copy>
    <HackerInstall />
  </Section>
);

export default FinalCta;
