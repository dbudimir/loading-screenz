'use client';

import styled, { keyframes } from 'styled-components';
import { MANUAL_INSTALL_URL } from '@/lib/site';

const PHOSPHOR = '#39ff14';

const blink = keyframes`
  50% { opacity: 0; }
`;

const alarm = keyframes`
  50% { box-shadow: 0 0 0 1px #000, 0 0 22px 4px rgb(255 40 20 / 0.75); }
`;

const glitch = keyframes`
  0%, 86%, 100% { transform: none; text-shadow: 1px 0 #ff2a2a, -1px 0 #00e5ff; }
  88% { transform: translateX(-2px) skewX(-8deg); text-shadow: -3px 0 #ff2a2a, 3px 0 #00e5ff; }
  92% { transform: translateX(2px); text-shadow: 3px 0 #ff2a2a, -3px 0 #00e5ff; }
`;

const Alert = styled.aside`
  overflow: hidden;
  border: 2px solid #000;
  border-radius: 4px;
  background: #050805;
  box-shadow: 0 0 0 1px #000, 0 0 12px 1px rgb(255 40 20 / 0.45);
  animation: ${alarm} 1.6s ease-in-out infinite;
  text-align: left;

  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      animation: none !important;
    }
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  background: repeating-linear-gradient(-45deg, #ffcc00 0 10px, #111 10px 20px);
  border-bottom: 2px solid #000;
`;

const Title = styled.h3`
  margin: 0;
  padding: 2px 10px;
  border: 1px solid #ff2a2a;
  background: #000;
  color: #fff;
  font: italic 13px / 1.3 var(--lz-font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: ${glitch} 3.2s steps(1) infinite;
`;

const Blink = styled.span`
  animation: ${blink} 0.9s steps(1) infinite;
`;

const Close = styled.span`
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1px solid #000;
  background: linear-gradient(180deg, #ff7a5c, #c41a00);
  color: #fff;
  font: bold 11px / 1 var(--lz-font-body);
`;

const Terminal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px 16px;
  color: ${PHOSPHOR};
  font: 13px / 1.5 var(--lz-font-mono);
  text-shadow: 0 0 6px rgb(57 255 20 / 0.6);

  /* CRT scanlines over the whole terminal. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, rgb(0 0 0 / 0.35) 0 1px, transparent 1px 3px);
    pointer-events: none;
  }
`;

const Line = styled.p<{ $warn?: boolean }>`
  margin: 0;
  color: ${({ $warn }) => ($warn ? '#ff3b2f' : 'inherit')};
  text-shadow: ${({ $warn }) => ($warn ? '0 0 6px rgb(255 59 47 / 0.7)' : 'inherit')};
`;

const Plain = styled.p`
  margin: 8px 0 6px;
  color: #c8ffbe;
  font-family: var(--lz-font-body);
  text-shadow: none;
`;

const HackButton = styled.a`
  position: relative;
  z-index: 1;
  align-self: flex-start;
  margin: 6px 0 4px;
  padding: 8px 16px;
  border: 2px solid ${PHOSPHOR};
  background: rgb(57 255 20 / 0.08);
  box-shadow: 0 0 10px rgb(57 255 20 / 0.5), inset 0 0 10px rgb(57 255 20 / 0.25);
  color: ${PHOSPHOR};
  font: bold 15px / 1.2 var(--lz-font-mono);
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
  transition: background var(--transition), color var(--transition);

  &:hover,
  &:focus-visible {
    background: ${PHOSPHOR};
    color: #000;
    text-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    align-self: stretch;
    text-align: center;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  vertical-align: -2px;
  background: ${PHOSPHOR};
  animation: ${blink} 1s steps(1) infinite;
`;

const HackerInstall = () => (
  <Alert aria-labelledby="hacker-install-title">
    <TitleBar>
      <Title id="hacker-install-title">
        <Blink aria-hidden="true">!! </Blink>
        Alert: Hackerz Only
        <Blink aria-hidden="true"> !!</Blink>
      </Title>
      <Close aria-hidden="true">x</Close>
    </TitleBar>
    <Terminal>
      <Line>C:\&gt; run l33t_install.exe</Line>
      <Line $warn>&gt; W4RN1NG: N0 W3B 5T0R3 D3T3CT3D</Line>
      <Line>&gt; 4CC3SS L3V3L: 1337 ... GR4NT3D</Line>
      <Plain>
        Don&apos;t need no stinkin&apos; web store? Grab the files from GitHub and load them into Chrome yourself with
        Developer mode. Seven steps, about two minutes, zero coding.
      </Plain>
      <HackButton href={MANUAL_INSTALL_URL}>[ Hackerz Only Install ]</HackButton>
      <Line aria-hidden="true">
        &gt; <Cursor />
      </Line>
    </Terminal>
  </Alert>
);

export default HackerInstall;
