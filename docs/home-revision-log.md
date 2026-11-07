# Home revision log

Each entry records the local timestamp, step, status, commit, and one-line result. The commit field is filled after the step commit; no history is rewritten to backfill it.

| Timestamp (Africa/Cairo) | Step                          | Status | Commit    | Result                                                                                                                                   |
| ------------------------ | ----------------------------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-07 12:12 EET     | Step 0 — audit and contract   | DONE   | `873630b` | Captured 8 baseline screenshots (1440×900 and 390×844, EN/AR, light/dark); no horizontal page overflow in any captured viewport.         |
| 2026-11-07 12:26 EET     | R1 — document flow and scroll | DONE   | `6b14f14` | Removed the rail and nested scrolling, retained the Select listbox as the only scroll container, and verified 1440px/390px on port 4200. |
| 2026-11-07 12:49 EET     | R2 — shared copy and code UI  | DONE   | pending   | Added reusable copy/code blocks, safe syntax highlighting, bash tokens, localized status, and replaced Home/showcase copy views.         |

## Step 0 audit findings

- Current experience: four sections (Hero, Experience, Decisions, Get started); five showcase packages in `PACKAGE_MANIFEST` (Select, Datepicker, Table, Modal, Toast).
- The section rail is visible on desktop and has a separate dot indicator in addition to the native page scrollbar. It is driven by `IntersectionObserver` and Home-only CSS in `src/styles.css`.
- Home code uses a scrolling `<pre>`. Showcase panes and code panels have multiple `overflow:auto` declarations; package tabs use horizontal scrolling below the mobile breakpoint. The Select headless listbox is separately scrollable at 18rem and should be the sole retained scroll region, reduced to 16rem. The table also has horizontal scrolling.
- Existing Home measurements found no page-level horizontal overflow at the two audited viewport sizes. This does not establish absence of nested scrolling, layout shift, clipping at short desktop height, or keyboard/contrast issues; those require implementation review.
- Source review confirms the playground route is currently a placeholder, so the revision will expose it as “coming soon” instead of presenting it as interactive.
- The installed Select demo exposes `query()`, `filtered()`, and `selectedLabels()` and wires package `select()`/`toggle()` calls. Active-option and selected-ID state APIs remain to be confirmed from installed typings before the R4 UI is built.
- Current baseline production bundle recorded by the existing production build: initial 400.85 kB raw / 100.12 kB transferred; Home lazy chunk 49.67 kB raw / 10.73 kB transferred. Re-run the gate to establish the commit-local before figures and record post-change sizes after implementation.
- Lighthouse and axe packages are not installed locally; the repository has no installed browser audit dependency. Do not add dependencies. Browser screenshots are available, but automated accessibility scores remain unverified unless a local executable is found.

## Baseline screenshots

- `docs/screenshots/revision/baseline-1440x900-en-light.png`
- `docs/screenshots/revision/baseline-1440x900-en-dark.png`
- `docs/screenshots/revision/baseline-1440x900-ar-light.png`
- `docs/screenshots/revision/baseline-1440x900-ar-dark.png`
- `docs/screenshots/revision/baseline-390x844-en-light.png`
- `docs/screenshots/revision/baseline-390x844-en-dark.png`
- `docs/screenshots/revision/baseline-390x844-ar-light.png`
- `docs/screenshots/revision/baseline-390x844-ar-dark.png`

## R1 evidence

- Architecture check rejects authored Home/showcase `overflow:auto|scroll` and `overflow-y:auto|scroll` declarations, except the exact `.headless-options` rule. Existing clipping and ellipsis rules remain intact.
- Browser check at 1440×900 and 390×844 (English, light) found no page-width overflow, no Home rail, no active nested scroll in Select/Table preview or Code views, and no page errors. Opening the headless options leaves only `.headless-options` scrollable (16rem max height).
- The installed Table component creates its own mobile scroller. The showcase demo now supplies 6rem flexible columns with wrapped cell text and locally overrides that scroller; mobile columns measured 107px each at 390px and fit without page overflow. The library package is unchanged.
- `npm run verify`: passed (7 test files, 28 tests). Existing CSS budget warnings remain for the Home and showcase stylesheets; the R1 build is under the 8kB Home error budget.
- R1 production build: initial 399.60 kB raw / 99.85 kB transferred; Home lazy chunk 48.35 kB raw / 10.22 kB transferred. These are intermediate numbers, not the final comparison.

- `docs/screenshots/revision/r1-1440x900-en-light.png`
- `docs/screenshots/revision/r1-390x844-en-light.png`

## R2 evidence

- Moved the tokenizer and spec with `git mv` into `src/app/shared/utils`; `<app-code-block>` uses Angular text interpolation and token spans, with no `innerHTML`. It accepts `ts`, `html`, `css`, and `bash`, and its code element is `dir="ltr" translate="no"`.
- `<app-copy-button>` keeps the accessible name stable within the selected language, uses the clipboard API with a hidden-textarea/`execCommand` fallback, reports failure after a bounded 2500ms, announces success for 2s, crossfades icons, and clears timers on replacement or destroy. Four fake-timer/fallback tests cover these states.
- All 8 rendered code blocks (hero install, two hero examples, showcase Code pane, and three Get Started steps) expose 44×44px copy controls. Browser review at 1440×900 in both themes and 390×844 light found no horizontal overflow, no active nested scroll, and no page errors.
- Computed syntax-token contrast against the code surface ranged from 6.85:1 to 20.98:1 in light and 8.63:1 to 15.53:1 in dark. The muted comment token had the lowest measured contrast; all token classes exceed 4.5:1.
- `npm run verify`: passed (8 test files, 33 tests). Existing Home/showcase component-style budget warnings remain; their current sizes are 6.52 kB and 6.05 kB, below the 8 kB error threshold.
- R2 production build: initial 398.78 kB raw / 99.32 kB transferred; Home lazy chunk 49.32 kB raw / 10.92 kB transferred. This is an intermediate comparison; R5 will capture the final bundle delta.

- `docs/screenshots/revision/r2-1440x900-en-light.png`
- `docs/screenshots/revision/r2-1440x900-en-dark.png`
- `docs/screenshots/revision/r2-390x844-en-light.png`
