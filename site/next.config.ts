import { join } from 'node:path';
import type { NextConfig } from 'next';

// The site imports the extension's theme CSS from ../src/theme, so the build root is the repo root.
const repoRoot = join(import.meta.dirname, '..');

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: repoRoot,
  },
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
