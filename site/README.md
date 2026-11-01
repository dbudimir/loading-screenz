# Loading Screens marketing site

The one-page promotional site for the Loading Screens browser extension. It uses the extension's Xbox theme and the early-2000s console web style, and every call to action points to installing the extension.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:7700](http://localhost:7700). `pnpm dev` and `pnpm build` first copy the loading screen videos and icon from the extension (`../public/`) into `public/`, so the site always shows what the extension ships.

## Environment variables

Local values live in `.env.local` (see `.env.example`).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | The site's URL, used for metadata, `robots.txt`, and the sitemap. On Vercel it falls back to the production domain |
| `NEXT_PUBLIC_INSTALL_URL` | Where every Install button goes. Defaults to the install steps in the GitHub README; switch it to the Chrome Web Store listing once it's published |

## How it's built

- Next.js 16 App Router with TypeScript, React 19, and styled-components, set up the same way as `budi-kit new` projects (Biome, Cursor rules, metadata, robots, sitemap, icon, and Open Graph image).
- Colors, textures, and the `lz-` components come straight from the extension's theme in `../src/theme/`, imported in `src/app/layout.tsx`. `next.config.ts` sets the build root to the repo root so that import works.
- The page is fully static.

## Project structure

```
site/
├── scripts/sync-assets.mjs  Copies videos and the icon from the extension into public/
├── src/
│   ├── app/                 Layout, page, 404, robots, sitemap, icon, and Open Graph image
│   ├── components/          Page sections: header, hero, info columns, gallery, control panel, FAQ, install
│   ├── lib/                 Site settings (URLs, copy) and the loader list
│   └── styles/main.css      Site layout tokens and global styles
└── .cursor/rules/           Cursor rules from budi-kit
```

## Deploying to Vercel

1. Import the `loading-screenz` repo in Vercel (or run `vercel link` from this folder).
2. Set **Root Directory** to `site`. Keep "Include files outside the root directory" on, since the site imports the theme and videos from the extension.
3. Set `NEXT_PUBLIC_INSTALL_URL` (and `NEXT_PUBLIC_APP_URL` if you use a custom domain).

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on port 7700 |
| `pnpm build` | Production build |
| `pnpm lint` / `pnpm lint:fix` | Biome checks |
| `pnpm type-check` | TypeScript |
