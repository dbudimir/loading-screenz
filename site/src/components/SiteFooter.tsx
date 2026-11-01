'use client';

import styled from 'styled-components';
import { GITHUB_URL, INSTALL_URL } from '@/lib/site';

const Stats = styled.div`
  margin-top: 14px;
`;

const Legal = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px 28px;
  text-align: center;
`;

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 0;
  font-size: var(--lz-text-sm);

  a {
    padding: 0 8px;
    border-right: 1px solid currentColor;
    color: var(--lz-page-text);
    text-decoration: none;
  }

  a:last-child {
    border-right: 0;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const StatsTicker = () => (
  <Stats className="lz-ticker" role="marquee" aria-label="Stats">
    <span>
      8 LEGENDARY SCREENS ··· 15 SECONDS MAX ··· 0 ACCOUNTS ··· 0 ADS ··· 100% LOCAL ··· UNLIMITED NOSTALGIA ··· NOW
      LOADING ···
    </span>
  </Stats>
);

export const ShellFooter = () => (
  <div className="lz-shell-foot">
    <span className="lz-logo">
      <span className="lz-logo-orb" />
      <span className="lz-logo-word">
        Loading <b>Screens</b>
      </span>
    </span>
    <span>Best viewed at 1024x768 or higher.</span>
  </div>
);

const SiteFooter = () => (
  <Legal>
    <Links aria-label="Footer">
      <a href={INSTALL_URL}>Install</a>
      <a href={GITHUB_URL}>Source on GitHub</a>
      <a href={`${GITHUB_URL}/issues`}>Report a Bug</a>
      <a href="#faq">FAQ</a>
    </Links>
    <p className="lz-fine">
      ©2026 Loading Screens. Not affiliated with or endorsed by Microsoft, Sony, Nintendo, Sega, Capcom, Rockstar Games,
      or Activision. All trademarks are the property of their respective owners.
    </p>
  </Legal>
);

export default SiteFooter;
