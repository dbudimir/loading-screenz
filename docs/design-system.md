# Design system

The extension's look is early-2000s console web design: the Y2K, dot-com, "Web 1.5" style of Xbox.com and PlayStation.com around 2000–2004. Each theme recreates one console's site from that era, and users pick their theme in settings.

## Principles

- **Hardware, not web pages.** The UI looks like a physical dashboard: chrome frames, brushed metal, speaker grilles, translucent plastic, and glowing LEDs.
- **Dense and framed.** Everything sits in a rigid, framed layout with tight spacing and small Verdana text, not wide-open minimalism.
- **Dark screens, neon accents.** Content sits on deep-space gradients, with high-saturation highlights and chunky bevels on everything clickable.
- **Era-correct type with no downloads.** Verdana and Tahoma for body text, Trebuchet MS for bold italic labels, and Arial Black for headings. They all ship with macOS and Windows.
- **One set of components, many themes.** Components only read design tokens (CSS variables). A theme is a set of token values plus, where needed, a few theme-specific touches.

## Structure

| File | Contents |
| --- | --- |
| `src/theme/tokens.css` | Theme-independent tokens: font stacks, type scale, spacing, radii, and the bevel recipes |
| `src/theme/themes/<theme>.css` | One file per theme, setting the color, gradient, and texture tokens under `[data-theme='<theme>']` |
| `src/theme/components.css` | Every component, as `lz-` prefixed classes that only use tokens |
| `src/theme/index.css` | Imports all of the above. Pages import this one file |
| `site/src/app/dev/styleguide/` | The style guide page: every component in every state, plus mockups of the popup and library page |

The style guide lives in the marketing site. Run `pnpm dev` in `site/` and open [localhost:7700/dev/styleguide](http://localhost:7700/dev/styleguide). Everything under `/dev` only exists in `next dev`; production builds return a 404.

## Components

| Component | Class | Inspired by |
| --- | --- | --- |
| Chrome frame with a wavy cap | `lz-shell` | The silver frame around Xbox.com |
| Tab nav | `lz-nav` | Xbox.com's Home / Games / Hardware strip |
| Deep-space screen | `lz-screen` | The dark feature area behind Halo 2 |
| Neon and display headings | `lz-heading`, `lz-display` | Green game titles, chrome logo type |
| Section header bar | `lz-bar` | "Upcoming Games" and "Halo 2 Tips and Info" |
| Dense link list | `lz-links` | The Xbox.com news columns |
| Beveled plastic buttons | `lz-button` | Sign In and GO buttons |
| Power toggle with LED | `lz-power` | Console power buttons |
| Chrome slider with LED readout | `lz-range`, `lz-led` | Hardware faders and dashboard displays |
| Dropdown | `lz-select` | PlayStation.com's "Explore a genre" menu |
| Checkbox and text input | `lz-check`, `lz-input` | Inset form fields |
| Badges | `lz-badge` | Xbox Live tags and "HOT Releases" |
| Monitor-framed video tile | `lz-tile` | Xbox.com's blue video thumbnails |
| Translucent panel | `lz-panel` | The tinted lower columns over game art |
| News ticker | `lz-ticker` | Era marquees |
| Drop zone | `lz-dropzone` | Speaker-grille texture with a dashed bezel |
| Textures | `lz-texture-*` | Brushed aluminum, speaker grille, carbon fiber, translucent plastic, deep space |

## Themes

### Xbox (built)

Xbox.com, 2002–2004. Pairs with the Halo and Xbox loaders.

- **Palette:** brushed silver chrome, black deep space with a cold blue glow, Xbox lime green (`#8cc63f`) for highlights, neon green headlines, and blue-steel section bars.
- **Signature pieces:** the chrome frame with a wavy top edge and a lime glow under the logo, a black tab bar with a lime active tab, and blue glass monitor frames around video tiles.
- **Textures:** brushed aluminum, the green core glow, and translucent warm-tinted panels over artwork.

### PlayStation 2

PlayStation.com, 1999–2001. Pairs with the PlayStation 2 loader.

- **Palette:** royal blue nebula (`#0b1a8f` to `#2346d8` cloud gradients), gold-yellow italic headings (`#f7d117`) with a dark outline, white underlined links, and red-orange "HOT" accents.
- **Signature pieces:** nav buttons as the triangle, circle, cross, and square face buttons in dark glass circles, a large vertical wordmark down the left edge, and flaming "HOT" and "Top 3" badges.
- **Textures:** blue nebula clouds, dark blue glass, and a circular chrome bezel for featured video (the Colin McRae Rally ring).
- **Theme-specific work:** face-button nav icons (CSS shapes) and the vertical wordmark.

### Dreamcast

Sega Dreamcast sites, 1999–2000. The light theme. Pairs with the Dreamcast loader.

- **Palette:** pearl white and translucent frosted plastic, Dreamcast swirl orange (`#f26b1d`), cool greys, and dark grey text.
- **Signature pieces:** the orange swirl as a spinner and bullet mark, rounded pill buttons like the controller's, and the LED readout restyled as the VMU's monochrome LCD.
- **Textures:** frosted plastic, soft white-to-grey gradients, and fine pinstripes.
- **Theme-specific work:** turning off the dark-screen glow effects, which don't suit a light theme, and a swirl drawn with a conic gradient.

### GameCube

Nintendo.com GameCube sites, 2001–2003. Pairs with the GameCube loader.

- **Palette:** indigo (`#4b3d8f`) and violet translucent plastic, with the controller's colors as accents: A-button green (`#2fb34a`), B-button red, and C-stick yellow.
- **Signature pieces:** chunky rounded buttons like the A and B buttons, a cube-outline logo mark, and Arial Black headings.
- **Textures:** translucent indigo plastic, a faint isometric cube grid, and glossy highlights.
- **Theme-specific work:** the cube grid background and the controller-colored button variants.

## Rollout

1. **Xbox theme, components, and style guide.** Done.
2. **Review and refine** the Xbox theme in the style guide.
3. **Apply to the extension:** the popup uses the Xbox theme (done). Still to do: restyle the library page with the components, add a `theme` setting with a picker in the popup and library page, and set `data-theme` on each page.
4. **Add the other themes** one at a time (PlayStation 2, Dreamcast, then GameCube): a token file each, any theme-specific pieces, and a pass through the style guide.
