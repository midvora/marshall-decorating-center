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

No analytics, trackers or cookies. All art is original SVG and CSS.

## Where things are

```
src/data/site.ts        address, phone, directions link (one source of truth)
src/data/palette.ts     room studio colors and project starter content
src/components/         one component per section, plus SampleGate.astro
src/scripts/            main.ts (motion, scroll), room.ts, starter.ts, gate.ts
src/styles/             global.css, gate.css
```

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

The page is marked `noindex,nofollow`.
