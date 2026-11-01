'use client';

import styled from 'styled-components';

const QUESTIONS = [
  {
    q: 'What does it actually do?',
    a: "When you click a link, there's a chance a fullscreen loading screen plays for a few seconds before the next page opens. Halo, PlayStation 2, Xbox, GameCube, and more, with sound.",
  },
  {
    q: 'Is it really free?',
    a: 'Yes. No ads, no account, no tracking. Your settings sync with your browser profile, and your uploaded videos never leave your computer.',
  },
  {
    q: 'Will it slow down my browsing?',
    a: "Only when a loading screen plays, and you're in control: set how often (1 to 100% of clicks) and how long (1 to 15 seconds), or flip the power off. The rest of the time it stays out of the way.",
  },
  {
    q: 'Can I add my own loading screens?',
    a: 'Absolutely. Open the library, drop in any MP4 or WebM, and it joins the rotation. Clips up to 15 seconds look best.',
  },
  {
    q: 'Which browsers does it work in?',
    a: 'Chrome 120 or newer, plus Chromium browsers like Edge, Brave, Arc, Opera, and Vivaldi.',
  },
  {
    q: 'Does it work on every site?',
    a: 'It works on regular links across the web. It skips links that open in a new tab, downloads, and links that web apps handle themselves, so nothing breaks.',
  },
];

const Section = styled.section`
  margin-top: 14px;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 14px;
  margin-top: 10px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.details`
  align-self: start;

  summary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--lz-tile-edge);
    border-radius: 4px;
    background: var(--lz-bar-bg);
    color: var(--lz-bar-text);
    font: bold italic var(--lz-text-md) var(--lz-font-label);
    text-shadow: var(--lz-bar-text-shadow);
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::before {
    content: '▶';
    font-size: 9px;
    transition: transform var(--transition);
  }

  &[open] summary::before {
    transform: rotate(90deg);
  }

  .lz-panel {
    border-top: 0;
  }
`;

const Faq = () => (
  <Section id="faq" aria-labelledby="faq-title">
    <h2 id="faq-title" className="lz-bar">
      Frequently Asked Questions
    </h2>
    <List>
      {QUESTIONS.map((item, index) => (
        <Item key={item.q} open={index === 0}>
          <summary>{item.q}</summary>
          <p className="lz-panel lz-text">{item.a}</p>
        </Item>
      ))}
    </List>
  </Section>
);

export default Faq;
