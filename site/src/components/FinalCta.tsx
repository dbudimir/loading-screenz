'use client';

import styled from 'styled-components';
import InstallButton from './InstallButton';

const Section = styled.section`
  margin-top: 14px;
  padding: 26px 28px;

  @media (max-width: 640px) {
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
  </Section>
);

export default FinalCta;
