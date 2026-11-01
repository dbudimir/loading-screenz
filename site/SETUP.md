# Loading Screenz site setup

This site was generated with `budi-kit`'s project generator (base features only) inside the extension repo, then built out as the marketing page.

## Differences from a standard `budi-kit new` project

- Lives in `site/` of the extension repo instead of its own repo, so no separate git repo, GitHub repo, or 77-projects registration.
- No Husky hooks or lint-staged: hooks are per repo, and installing them from this folder would change commit behavior for the extension too.
- No Inter font: the Xbox theme uses era system fonts (Verdana, Trebuchet MS, Arial Black).
- Design tokens come from the extension's `../src/theme/` rather than `src/styles/main.css`.
- No `loading.tsx`, since the page is fully static.

## Next steps

- [ ] Publish the extension and set `NEXT_PUBLIC_INSTALL_URL` to its Chrome Web Store listing
- [ ] Choose a domain and set `NEXT_PUBLIC_APP_URL`
- [ ] Deploy on Vercel with Root Directory set to `site`
- [ ] Get permission for the loading screen videos before launching publicly (see the extension README's publishing notes)
