# PREMIUM™

### A polished, static SaaS-style workspace demo.

> **IMPORTANT: THIS IS A FRONT-END DEMO, NOT A REAL PAYMENT GATEWAY.**
> The “Purchase” / “Place demo order” flow only simulates buying Premium for demonstration purposes. No money is charged, no card/payment details are processed, and no real subscription or payment transaction is created. A “Purchased” or “Order complete” screen is a visual demo confirmation only.


PREMIUM™ is a responsive, installable front-end experience built with HTML, CSS, and vanilla JavaScript. It includes dashboard surfaces, a simulated checkout, account and billing interactions, accessibility controls, and a playful Reality Lab.

## Current release

**V55 — In-memory-only app state**

- Responsive workspace UI for phones, tablets, laptops, and desktops
- Installable Progressive Web App with an offline static-asset shell
- Workspace, account, billing, security, support, and activity interactions
- Three-stage simulated checkout with plan selection, demo coupon, processing feedback, and receipt
- Paid demo plan activates immediately after the simulated checkout
- Premium status remains active only while the current page is open
- Refreshing, closing, or reopening the page resets the plan to **Free**
- No database, backend, authentication service, or real payment processor
- No `localStorage`, `sessionStorage`, IndexedDB, or cookies for app/user state
- All workspace activity, preferences, account details, and selected plans live only in JavaScript memory and are lost on reload
- The service worker may cache static application files for PWA/offline loading; it does not persist workspace or purchase state

## Payment and purchase disclaimer

**This repository does not implement or connect to a real payment gateway.** The checkout UI is intentionally designed to feel like a premium purchase for demo/testing purposes only. Clicking the purchase button activates a temporary Premium state in the currently open page; it does not mean that a real payment succeeded.

Checkout is a **demo only**. It does not charge money, validate a real payment, or create a real subscription. A displayed receipt is illustrative and does not prove a real purchase. The plan is held in memory only, so it cannot persist across a refresh or browser restart.

## Architecture

- **HTML** — page structure
- **CSS** — responsive design and interaction styling
- **Vanilla JavaScript** — behavior and temporary in-memory state
- **Service worker** — static asset caching for supported PWA/offline behavior
- **Web app manifest** — install metadata
- **GitHub Pages** — static hosting compatible

## Run locally

Open `index.html` for the core page. For service-worker and install support, serve the repository over HTTPS or localhost.

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

In the repository, open **Settings → Pages → Deploy from branch → main → / (root)**.

## Status

- **Release:** V55
- **Hosting:** GitHub Pages compatible
- **Database/backend:** None
- **Payment processing:** None
- **App state persistence:** None; JavaScript memory only
- **Installable:** Supported browsers
- **Offline shell:** Static assets can be cached after first load
