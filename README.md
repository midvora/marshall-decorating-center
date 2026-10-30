# Marshall Decorating Center | sample website

An unofficial design concept by Midvora. It is a design sample, not Marshall Decorating Center's current website, and details should be confirmed with the business.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the built site
npm run check      # astro check (types)
```

Needs Node 22.12 or newer.

## Stack

| Piece | Why |
| --- | --- |
| Astro 6 | Static output, no framework runtime on the page |
| GSAP + ScrollTrigger + SplitText | Scroll reveals, masked headline lines, paint roller timeline |
| Lenis | Smooth scrolling (off for reduced motion) |
| Fontsource (Fraunces, Instrument Sans, DM Mono) | Self hosted fonts, no remote font requests |

No analytics, trackers or cookies. Photos are the store's own (see below); the page chrome, paint chips and motion are SVG and CSS.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: real storefront hero, weekly fall promo, explore the store, project starter, seasons, about teaser, visit |
| `/shop/` | The "middle" between a landing page and a store: browse real displays, filter by department, build **My list**, send it as a quote or pickup request (sample: nothing is sent) |
| `/paint/` `/flooring/` `/window-treatments/` `/home-decor/` | One page per department |
| `/promotions/` and `/promotions/<slug>/` | This week's promo plus an archive. Each promo gets its own page. Not in the nav on purpose (these pages are for search); the home page promo section links to the current one |
| `/about/` | The family story, timeline and team |
| `/visit/` | Live open/closed status, hours, map, contact form (sample), FAQ |

## Where things are

```
src/data/site.ts        address, phone, hours, nav (one source of truth; hours drive the open/closed badge)
src/data/photos.ts      every photo in one place, with alt text and default crop. Swap a picture here
src/data/promos.ts      the weekly promotions. Change the promo by editing this file
src/data/shop.ts        the shop catalog (departments and displays, no prices)
src/data/palette.ts     room studio colors and project starter content
src/assets/photos/      the photo files (optimized to webp at build time)
src/components/         sections (Hero, Promo, Categories, Seasons, ...) and shared pieces (PageHero, Split, FeatureGrid, ...)
src/pages/              one file per route
src/scripts/            main.ts (motion, scroll), list.ts (My list, shop filters), status.ts (open now), room.ts, starter.ts, gate.ts
src/styles/             global.css, gate.css
```

## Changing the weekly promotion

1. Add or edit an entry in `src/data/promos.ts` and set its `status` to `current` (the previous one becomes `past`).
2. Point `items[].photo` at keys in `src/data/photos.ts`, adding new photos to `src/assets/photos/` as needed.
3. Build. The home page section, the promotions list and the promo's own page all update.

## Photos

Real store photos come from the store's Facebook page and website. The home hero is `storefront.webp` (replace that one file with your own shot later; it is also used on About and Visit). The photo of the couple comes from a Marshall Independent article: `credit` on `owners` in `photos.ts` adds a small "Photo via Marshall Independent" link under it (remove the `credit` to hide it). The window-treatment pictures are free-license stand-ins from Unsplash and show a small "Sample photo" tag; replace them with the store's own (`stock: true` in `photos.ts` controls the tag). Price tags in the original flooring photo were cropped out on purpose, because prices go stale.

## Visitor gate

Before the sample opens, visitors see a Midvora card asking for their name and email. When a key is present at build time, Midvora gets an email notification through Web3Forms and the sample opens. It is a soft gate: it records who looked and does not hide the files.

| | |
| --- | --- |
| `VITE_GATE_KEY` | Web3Forms access key (a public key by design). On GitHub, set it as an Actions repository **variable**: Settings, Secrets and variables, Actions, Variables |
| No key at build time | The gate is off and the site opens directly (the build logs a console warning) |
| `VITE_FORCE_GATE=1 npm run dev` | Shows the gate with nothing sent, for design and testing |
| Local test with a key | Copy `.env.example` to `.env.local` |

The only network request the page makes is that notification, and only when a visitor submits the gate. Keys are read at build time, so redeploy after changing the variable.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`. The project path (`/<repo>/`) comes from `GITHUB_REPOSITORY` in `astro.config.mjs`.

One time setup: Settings, Pages, Source: **GitHub Actions**.

Every page is marked `noindex,nofollow`. The site is served under `/<repo>/`, so internal links go through `url()` in `src/lib/url.ts`; build with `GITHUB_ACTIONS=true GITHUB_REPOSITORY=<owner>/<repo>` to test that base path locally.
