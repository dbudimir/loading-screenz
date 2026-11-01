import * as esbuild from 'esbuild';
import { cp, rm } from 'node:fs/promises';

const watch = process.argv.includes('--watch');

await rm('dist', { recursive: true, force: true });
await cp('public', 'dist', { recursive: true });

// Content scripts can't be ES modules, so every entry is bundled as a standalone IIFE.
const options = {
  entryPoints: {
    content: 'src/content/index.ts',
    popup: 'src/popup/main.tsx',
    options: 'src/options/main.tsx',
    player: 'src/player/main.ts',
  },
  outdir: 'dist',
  bundle: true,
  format: 'iife',
  target: 'chrome120',
  jsx: 'automatic',
  loader: { '.svg': 'dataurl' },
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  define: { 'process.env.NODE_ENV': JSON.stringify(watch ? 'development' : 'production') },
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
