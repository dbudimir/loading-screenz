const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:7700');

export const INSTALL_URL = process.env.NEXT_PUBLIC_INSTALL_URL ?? 'https://github.com/dbudimir/loading-screenz#install';

export const GITHUB_URL = 'https://github.com/dbudimir/loading-screenz';

export const SITE_NAME = 'Loading Screens';

export const TAGLINE = 'Every click is a loading screen.';

export const DESCRIPTION =
  'A free browser extension that turns link clicks into classic video game loading screens and console startups. Halo, PlayStation 2, Xbox, GameCube, Dreamcast, and more.';
