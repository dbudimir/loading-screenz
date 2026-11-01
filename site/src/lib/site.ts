const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:7700');

export const INSTALL_URL = process.env.NEXT_PUBLIC_INSTALL_URL ?? 'https://github.com/dbudimir/loading-screenz#install';

export const GITHUB_URL = 'https://github.com/dbudimir/loading-screenz';

/** Step-by-step guide for loading the extension unpacked from a GitHub release, for people who'd rather skip the store. */
export const MANUAL_INSTALL_URL = `${GITHUB_URL}#install-without-the-chrome-web-store`;

export const SITE_NAME = 'Loading Screenz';

export const TAGLINE = 'Every click is a loading screen.';

export const DESCRIPTION =
  'A free browser extension that turns link clicks into classic video game loading screens and console startups. Halo, PlayStation 2, Xbox, GameCube, Dreamcast, and more.';
