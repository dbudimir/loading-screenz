'use client';

import styled from 'styled-components';
import InstallButton from './InstallButton';

const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#screens', label: 'Screens' },
  { href: '#features', label: 'Features' },
  { href: '#controls', label: 'Control Panel' },
  { href: '#faq', label: 'FAQ' },
  { href: '#install', label: 'Install' },
];

const Cap = styled.header`
  padding-top: 0;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Logo = styled.a`
  .lz-logo-orb {
    width: 34px;
    height: 34px;
  }

  .lz-logo-word {
    font-size: 22px;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .lz-logo-orb {
      width: 24px;
      height: 24px;
    }

    .lz-logo-word {
      font-size: 15px;
    }
  }
`;

const Edition = styled.span`
  padding-left: 42px;
  font-size: var(--lz-text-xs);
  color: var(--lz-page-text);

  @media (max-width: 640px) {
    display: none;
  }
`;

const Utility = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  margin-top: 40px;
  font-size: var(--lz-text-xs);

  @media (max-width: 640px) {
    span {
      display: none;
    }
  }
`;

const SiteHeader = () => (
  <>
    <Cap className="lz-shell-cap">
      <Brand>
        <Logo className="lz-logo" href="#top">
          <span className="lz-logo-orb" />
          <span className="lz-logo-word">
            Loading <b>Screens</b>
          </span>
        </Logo>
        <Edition>Browser Extension | Version 1.1 | United States</Edition>
      </Brand>
      <Utility>
        <span>Free for Chrome</span>
        <InstallButton />
      </Utility>
    </Cap>
    <nav className="lz-nav" aria-label="Sections">
      {NAV.map((item, index) => (
        <a key={item.href} href={item.href} aria-current={index === 0 ? 'page' : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
    <div className="lz-rail" />
  </>
);

export default SiteHeader;
