import StyledComponentsRegistry from '@/lib/registry';
import { DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from '@/lib/site';
import '../../../src/theme/index.css';
import '@/styles/main.css';
import type { Metadata, Viewport } from 'next';

// The Xbox theme from the extension (src/theme/) uses era system fonts (Verdana, Trebuchet MS, Arial Black),
// so there's no next/font here. Icons and the Open Graph image come from src/app/icon.svg and opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${TAGLINE}`,
    template: `${SITE_NAME} | %s`,
  },
  description: DESCRIPTION,
  keywords: [
    'loading screens',
    'chrome extension',
    'retro gaming',
    'Halo loading screen',
    'PS2 startup',
    'Xbox startup',
    'GameCube startup',
    'Dreamcast',
  ],
  authors: [{ name: 'budimir.dev', url: 'https://budimir.dev' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME}: ${TAGLINE}`,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Full bleed: lay out to the full screen (under the Dynamic Island and
  // home indicator) so the page background reaches every edge. Content
  // keeps clear of those areas via env(safe-area-inset-*) padding.
  viewportFit: 'cover',
  // Matches the page background (--lz-page-bg mid stop), not the dark screen
  // panel: iOS Safari paints the status-bar and home-indicator areas with
  // this color, so a dark value shows up as black bars top and bottom.
  themeColor: '#e9ece9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="xbox">
      <body className="lz-page">
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
