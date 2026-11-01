# Plan: opt-in website access

Status: **not started.** Only worth building if the Chrome Web Store review stays slow or gets rejected over host permissions.

## Why

The Chrome Web Store flags Loading Screenz for an in-depth review because of "Broad Host Permissions." The content script is declared in the manifest to run on every `http` and `https` page, so the extension gets access to every site at install.

Neither of the store's suggestions fits:

- `activeTab` only grants access to a tab after the user clicks the toolbar icon, and only until that tab navigates. Loading screens would stop after the first page.
- Listing specific sites would turn this into a different product.

The alternative: install with **no site access**, and let the user turn it on later with one click. Access is requested at runtime through Chrome's permission prompt, so nothing broad is granted at install. Reviews of extensions that only use optional host permissions tend to be lighter, though the store doesn't promise it.

The tradeoff is one extra step for users before the first loading screen plays.

## How it would work for users

1. Install the extension. Nothing happens on websites yet.
2. A welcome tab opens: "Loading Screenz needs permission to run on websites so it can show a loading screen when you click a link." One button: **Turn on for all websites**.
3. Chrome shows its permission prompt ("Read and change all your data on all websites"). The user clicks Allow.
4. Loading screens start working right away, including in tabs that were already open.
5. The popup shows the website access state. If access is off (never granted, or removed later in Chrome's settings), the power switch is replaced by a **Turn on for all websites** button.

A later option: **Only on sites I choose**, which requests one site at a time (`chrome.permissions.request({ origins: ['https://example.com/*'] })`) from the popup.

## Changes

### Manifest (`public/manifest.json`)

- Remove the `content_scripts` entry.
- Add `"optional_host_permissions": ["http://*/*", "https://*/*"]`.
- Add `"scripting"` to `permissions`, to register the content script at runtime.
- Add a background service worker: `"background": { "service_worker": "background.js" }`.
- Keep `web_accessible_resources` as is. It doesn't grant site access; it only lets pages load the player.

### Background service worker (new: `src/background/index.ts`, plus an entry in `build.mjs`)

- `syncContentScript()`: check `chrome.permissions.contains({ origins })`.
  - If granted, register the content script once with `chrome.scripting.registerContentScripts([{ id: 'loading-screenz', matches: ['http://*/*', 'https://*/*'], js: ['content.js'], runAt: 'document_idle', persistAcrossSessions: true }])`, skipping it if `getRegisteredContentScripts` already lists it.
  - If not granted, unregister it.
- Call `syncContentScript()` on `runtime.onInstalled`, `runtime.onStartup`, `permissions.onAdded`, and `permissions.onRemoved`.
- On `permissions.onAdded`, also inject `content.js` into tabs that are already open (`chrome.tabs.query` + `chrome.scripting.executeScript`), so users don't have to refresh them.
- On first install (`onInstalled` with `reason === 'install'`), open the welcome page.

### Welcome page (new: `public/welcome.html`, `src/welcome/main.tsx`)

- Xbox-themed page explaining why access is needed, with the **Turn on for all websites** button calling `chrome.permissions.request({ origins: [...] })`.
- Show success ("You're all set. Click any link to try it.") or what to do if the prompt was dismissed.
- Request permission from this tab rather than the popup: Chrome's prompt can close the popup, and the request's promise doesn't always resolve there.

### Popup (`src/popup/main.tsx`)

- Read the access state with `chrome.permissions.contains` and listen for `permissions.onAdded` and `onRemoved`.
- Without access: replace the power switch with a **Turn on for all websites** button that opens the welcome page, and a short line explaining why.
- With access: unchanged.

### Content script (`src/content/index.ts`)

- No logic changes. Guard against running twice in one page (a registered script plus the injection into open tabs) with a flag on `window`.

### Store listing (`docs/publishing.md`)

- Remove the host permission justification.
- Add a `scripting` justification: "Registers the content script on websites only after the user grants access from the welcome page or popup."
- Mention the optional permission in the description: "Asks for permission to run on websites after you install it."

### Site and README

- FAQ and install steps: mention the one-time "Turn on for all websites" step.

## Things to check

- **Upgrades from a version with the manifest content script.** Find out whether Chrome keeps access that was granted at install once the same sites move to `optional_host_permissions`. If it doesn't, existing users see the welcome flow again after updating. Test by loading the current version, then updating to the new one in place.
- **Unpacked installs** (the GitHub route) follow the same flow, so the README steps need the extra click too.
- **Chrome's own site access controls** ("On click", "On specific sites") should keep working, because they map to the same permissions.
- Version bump: this is a new upload, so the store review starts over.

## Testing

Extend the package test (`/tmp/ext-test/test-zip.mjs` during development; consider moving it into `scripts/`):

1. Fresh install: no overlay on link clicks, and the welcome tab opens.
2. Grant access (in Puppeteer, grant through `chrome.permissions` from an extension page): the overlay plays on link clicks, including in a tab that was open before.
3. Remove access: the overlay stops, and the popup shows the **Turn on** button.
4. Restart the browser with access granted: the content script is still registered.

## Size

About a day of work: a small background script, a welcome page, popup changes, and testing the upgrade path.
