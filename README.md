# PREMIUM™
### Modern workspace infrastructure for teams that expect more from less.

PREMIUM™ is a polished, static SaaS-style workspace experience with persistent browser state, account workflows, billing surfaces, operational controls, responsive layouts, accessibility improvements, and installable PWA support.

The interface stays professional. The workspace state has considerably more personality. Reality Lab adds playful, local-only experiments without changing the existing account, billing, security, support, or workspace routes.

## Current release

**V52 — Purchase-respecting experience**

- Installable Progressive Web App
- Offline application shell with service-worker caching
- Responsive layouts from compact phones to ultrawide displays
- Accessible skip navigation and status announcements
- Light/dark appearance preference
- Reduced-motion preference
- Persistent workspace state through localStorage
- Account, billing, operations, security, support, and workspace intelligence surfaces
- Workspace export and local reset controls<br>- Live workspace telemetry, keyboard workflow helpers, notification state, and update detection<br>- Reality Lab with reversible visual modes, a focus bubble, absurd fortunes, and rubber-duck debugging tips
- Three-stage animated demo checkout with plan selection, order summary, DEMO10 promo interaction, processing feedback, and a receipt screen
- Purchase-respecting UI: after a paid demo checkout, Premium upsells and promotional sections stay hidden across reloads in that browser
- No ad network or purchase-based ad targeting; the stored plan is used only to suppress upgrade promotions
- Explicit no-payment messaging; no real payment gateway, card collection, or backend processing
- Keyboard-operable experiments with reduced-motion support
- Versioned static assets and refreshed offline cache
- Browser-only architecture with no backend, database, or payment processor

## Architecture

- **HTML** — application structure and product surfaces
- **CSS** — responsive design system
- **Vanilla JavaScript** — application behavior, state, workflows, and persistence
- **localStorage** — browser-side workspace state
- **Service Worker** — cached application shell and offline support
- **Web App Manifest** — installation metadata
- **GitHub Pages** — static hosting

## Running locally

Open `index.html` in a modern browser for the core experience.

For full PWA/service-worker behavior, serve the repository through a local HTTP server or GitHub Pages. Service workers require a secure context such as HTTPS; localhost is also supported.

## Responsive behavior

The interface uses fluid sizing, adaptive grids, touch-friendly controls, safe mobile viewport handling, overflow protection, and large-screen content constraints.

The target is one product surface that remains usable across phones, tablets, laptops, desktops, and ultrawide displays.

## PWA behavior

The application can be installed from a compatible browser. The service worker caches the core shell and refreshes cached resources when network access is available.

After the application has been cached, the core shell remains available when the network disappears.

## Persistence

Workspace state uses the localStorage key `premium-workspace-v1`.

The browser may remember visits, activity, subscription state, account value, role, team size, appearance preference, and operational events.

Clearing site data resets the local workspace.

## Operational behavior

Most actions begin as ordinary SaaS interactions. Persistent state allows later visits to reflect earlier activity. Some events are randomized, some are state-dependent, and some are confidently more complicated than necessary.

The application does not process real payments or create real financial obligations.

## Project structure

```text
PREMIUM-/
├── index.html
├── style.css
├── script.js
├── upgrade.js
├── manifest.webmanifest
├── sw.js
├── icon.svg
└── README.md
```

## GitHub Pages

Enable **Settings → Pages → Deploy from branch → main → / (root)**.

## V52 additions

- Persisted the locally selected demo plan in browser storage so the post-purchase experience survives refreshes
- Suppressed upgrade buttons, pricing promotions, Premium feature marketing, and the final sales CTA after a paid demo purchase
- No ad network, ad profiling, or purchase-based ad targeting; Reset workspace clears the local purchase state

- Added a self-contained Reality Lab panel without replacing existing workspace routes
- Added non-repeating absurd fortunes and debugging tips per browser session
- Added reversible focus, glitch, and orbit modes with Escape-key exit and reduced-motion handling
- Versioned HTML/CSS/JavaScript, manifest, and service-worker cache together
- Updated offline cache fallback and install metadata

## Earlier workspace additions

- Command palette with keyboard shortcut `Ctrl/Cmd + K` and centralized command routing
- Quick actions for billing, activity, security, account, preferences, appearance, installation, and upgrade
- Notification unread state with automatic clearing
- Service-worker update detection with in-app refresh control
- Persistent appearance and accessibility preferences
- Faster navigation without leaving the current workspace

## Status

**Production status:** Operational  
**Release:** V52  
**Backend:** None  
**Database:** None  
**Payment processor:** None  
**Hosting:** GitHub Pages compatible  
**Installable:** Yes, on supported browsers  
**Offline shell:** Yes, after the application has been cached

---

### Operational note

PREMIUM™ is a front-end product experience. If the interface becomes unusually specific about your organizational responsibilities, review the browser state before contacting Finance.
