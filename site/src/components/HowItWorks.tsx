'use client';

import styled from 'styled-components';

const STEPS = [
  { title: 'Install it', text: 'Free from the Chrome Web Store in one click.' },
  { title: 'Browse like normal', text: 'Click any link, anywhere on the web.' },
  { title: 'Boom. Loading screen.', text: 'A classic boot-up plays, then your page opens.' },
];

const Section = styled.section`
  margin-top: 14px;
  border: 1px solid #000;
`;

const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  list-style: none;
  counter-reset: step;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  li {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 10px;
    align-items: start;
    counter-increment: step;
  }

  li::before {
    content: counter(step);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--lz-button-primary-edge);
    border-radius: 50%;
    background: var(--lz-button-primary-bg);
    color: #fff;
    font: bold 14px var(--lz-font-body);
    box-shadow: var(--lz-bevel-raised);
  }
`;

const StepTitle = styled.strong`
  display: block;
  color: var(--lz-panel-link);
  font: bold 13px var(--lz-font-body);
`;

const HowItWorks = () => (
  <Section id="how-it-works" aria-labelledby="how-it-works-title">
    <h2 id="how-it-works-title" className="lz-bar">
      How It Works
    </h2>
    <Steps className="lz-panel">
      {STEPS.map(step => (
        <li key={step.title}>
          <span className="lz-text">
            <StepTitle>{step.title}</StepTitle>
            {step.text}
          </span>
        </li>
      ))}
    </Steps>
  </Section>
);

export default HowItWorks;
