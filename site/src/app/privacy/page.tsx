import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { SiteFooter } from '@/components';
import { GITHUB_URL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${SITE_NAME} collects no personal data. Here's exactly what the extension stores and where.`,
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = 'November 1, 2026';

const pageStyle: CSSProperties = {
  maxWidth: '760px',
  margin: '0 auto',
  padding: '28px var(--site-gutter) 0',
};

const screenStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '30px 32px',
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

export default function Privacy() {
  return (
    <div style={pageStyle}>
      <main className="lz-screen lz-texture-space" style={screenStyle}>
        <span>
          <span className="lz-led">PRIVACY POLICY</span>
        </span>
        <h1 className="lz-display">No data. No tracking.</h1>
        <p className="lz-fine">Last updated {LAST_UPDATED}</p>
        <p className="lz-text">
          {SITE_NAME} is a browser extension that plays a short loading screen video when you click a link. It doesn't
          collect, sell, or share any personal information, and it never sends anything to us or anyone else.
        </p>

        <section style={sectionStyle}>
          <h2 className="lz-heading">What the extension stores</h2>
          <ul className="lz-text">
            <li>
              <strong>Your settings</strong> (on or off, which loading screen, frequency, duration, and which screens
              are in the random rotation) are saved in your browser&apos;s extension storage. If you&apos;re signed in
              to Chrome with sync turned on, Chrome syncs these settings to your other computers through your Google
              account. We never see them.
            </li>
            <li>
              <strong>Videos you add to your library</strong> are saved only on your computer, in the extension&apos;s
              local database. They&apos;re never uploaded.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 className="lz-heading">What it doesn&apos;t do</h2>
          <ul className="lz-text">
            <li>No accounts, analytics, ads, or tracking.</li>
            <li>
              No network requests. Every built-in loading screen is bundled inside the extension, so it works offline.
            </li>
            <li>
              It doesn&apos;t read or record the pages you visit. It runs on websites only to notice when you click a
              link, show the loading screen, and then open that link.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 className="lz-heading">Removing your data</h2>
          <p className="lz-text">
            Delete videos from the library page at any time. Uninstalling the extension removes all of its settings and
            videos from your browser.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 className="lz-heading">This website</h2>
          <p className="lz-text">
            This site doesn&apos;t use cookies or analytics. Our host, Vercel, may keep standard server logs (like IP
            addresses) for security and reliability.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 className="lz-heading">Questions</h2>
          <p className="lz-text">
            Open an issue on <a href={`${GITHUB_URL}/issues`}>GitHub</a>. If this policy ever changes, the new version
            will be posted here with a new date.
          </p>
        </section>

        <span>
          <Link className="lz-button lz-button--primary" href="/">
            Return to Dashboard
          </Link>
        </span>
      </main>
      <SiteFooter />
    </div>
  );
}
