# Rivinia Docs homepage refinement report

## Done

- Completed the approved homepage milestones in separate commits: `4ba4dbe` (UX contract), `943ce97` (font and layout tokens), `1d9169a` (hero), `464b0d7` (interactive showcase), `8675b76` (evidence-backed decisions), `5081caf` (setup guide and footer), and `6ad9125` (navigation, section rail, and responsive fixes).
- Downloaded and self-hosted the Inter variable WOFF2 from Google Fonts. `@font-face` loads it for Latin text; IBM Plex Sans Arabic serves Arabic text and JetBrains Mono serves code. Browser check `document.fonts.check('16px Inter')` returned true.
- Reduced primary navigation to Docs, Components, and Playground. `/guides` now redirects to `/docs`.
- Added a keyboard reachable, translated desktop section rail. It appears from 1100px and uses the shared section observer to track the active section.
- Fixed mobile RTL horizontal overflow and fixed the showcase workspace height. Switching among the five demos measured 576px on desktop; Preview/Code measured 464px on mobile.
- Captured 16 viewport screenshots for 1920×1080, 1440×900, 1366×768, and 390×844 across English/Arabic and light/dark, plus three full-page screenshots in `docs/screenshots/`. Chrome reported `scrollWidth` equal to the viewport at every matrix combination.
- Measured contrast in Chrome. Light theme: body 14.80:1, muted body copy 6.39:1, primary CTA 8.77:1. Dark theme: body 16.70:1, muted body copy 9.28:1, primary CTA 9.55:1.
- Verified keyboard arrow navigation across the showcase tabs, `/guides` redirect behavior, and reduced-motion styles (`transition-duration: 0s`, `scroll-behavior: auto`).
- `npm run verify` passed: Prettier, architecture check (zero temporary exceptions), generated-source check, production build, and Vitest (7 files, 28 tests). `git diff --check` passed.
- Production build initial bundle: 399.82 kB raw / 99.89 kB estimated transfer. Homepage remains lazy loaded (49.31 kB raw / 10.68 kB estimated transfer).

## Blocked

- No implementation milestone is blocked.

## Decisions made

- Removed the unsupported “Fast by default” promise and used “Signal-based state,” which matches the package source without claiming a benchmark result.
- Narrowed accessibility copy to the documented ready-UI behavior and the consumer responsibilities of headless markup.
- Kept package documentation links on the existing general `/docs` route because no package-specific documentation routes exist.
- Preserved the three navigation destinations and redirected the former Guides route for compatibility.

## Claims removed because unverifiable

- No measured speed or performance guarantee is made.
- No blanket accessibility guarantee is made for consumer-authored headless markup.
- No global version badge is shown because the root application version is `0.0.0`; the page uses verified Select package metadata instead.

## Not verified (tooling missing)

- Axe was not run: neither `axe-core` nor `@axe-core/playwright` is installed. Manual keyboard, focus, reduced-motion, responsive, and contrast checks were performed; these do not substitute for Axe.
- Lighthouse was not run because no local Lighthouse executable/package is available. No Lighthouse score or performance audit is claimed.
- Browser review used the installed Chrome only. Firefox, WebKit, and physical-device review were not performed.
- Build emits existing Angular component-style budget warnings: homepage CSS 7.90 kB and showcase CSS 7.51 kB, above the 4 kB warning threshold but below the 8 kB error threshold. The configured budget was not changed.

## Recommended next steps

- Run the project’s approved Axe and Lighthouse checks when those tools are available in the existing environment; no dependency was added for this pass.
- If component styles continue to grow, split or reduce those styles before they reach the configured 8 kB error threshold.

## Five-second test

- **What is Rivinia?** Signal-based Angular packages with headless logic and ready-made UI.
- **Who is it for?** Angular developers who want to choose their own markup or use matching UI.
- **Where should I start?** Get started, then install `@rivinia/select` and read the docs.
