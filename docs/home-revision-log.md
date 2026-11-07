# Home revision log

Each entry records the local timestamp, step, status, commit, and one-line result. The commit field is filled after the step commit; no history is rewritten to backfill it.

| Timestamp (Africa/Cairo) | Step                           | Status | Commit    | Result                                                                                                                                                                |
| ------------------------ | ------------------------------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-07 12:12 EET     | Step 0 — audit and contract    | DONE   | `873630b` | Captured 8 baseline screenshots (1440×900 and 390×844, EN/AR, light/dark); no horizontal page overflow in any captured viewport.                                      |
| 2026-11-07 12:26 EET     | R1 — document flow and scroll  | DONE   | `6b14f14` | Removed the rail and nested scrolling, retained the Select listbox as the only scroll container, and verified 1440px/390px on port 4200.                              |
| 2026-11-07 12:49 EET     | R2 — shared copy and code UI   | DONE   | `2f60239` | Added reusable copy/code blocks, safe syntax highlighting, bash tokens, localized status, and replaced Home/showcase copy views.                                      |
| 2026-11-07 13:22 EET     | R3 — showcase geometry         | DONE   | `5fda836` | Tied tabs to the manifest, reserved measured preview space, and wrapped mobile package tabs without overflow.                                                         |
| 2026-11-07 13:55 EET     | R4 — headless Select           | DONE   | `dc04928` | Added the genuine package-backed headless multi-select, keyboard behavior, removable chips, live state, and localized labels.                                         |
| 2026-11-07 14:20 EET     | R5 — Deferred Experience       | DONE   | `d275c95` | Deferred the interactive showcase until it enters view, with idle prefetch, a measured placeholder, retry, and reduced-motion-aware reveal.                           |
| 2026-11-07 14:39 EET     | R6 — Four Pillars. One Core.   | DONE   | pending   | Replaced Decisions with four evidence-based pillar cards around the responsive brand mark, including keyboard and RTL states.                                         |
| 2026-11-07 15:35 EET     | Showcase review comments       | DONE   | `a624088` | Fixed code/copy presentation, added date/time and table interactions, modal save/delete flows, scoped toast preview, and all 11 footer packages.                      |
| 2026-11-07 15:56 EET     | Preview overlay containment    | DONE   | `0118907` | Centered the native modal in the preview via CSS anchor positioning and placed real toast actions at the preview's bottom-right; visually verified both on port 4200. |
| 2026-11-07 16:00 EET     | Remove footer package metadata | DONE   | `231e015` | Removed the Select-only license and version from the shared footer; verified all 11 package links and the preferences control remain.                                 |

### Showcase review comments evidence

- On the existing port 4200 tab, visually inspected code direction/copy controls, the Datepicker examples and source tabs, table actions and page-size Select, nested modal replacement and unsaved-change guard, and toast placement inside its preview area. Checked Arabic RTL and both theme selections.
- The first verify pass reported stale generated modal source after the last component edit. `npm run build` refreshed it through `prebuild`; the subsequent complete `npm run verify` passed: Prettier, architecture (0 temporary exceptions), generator check, production build, and 11 test files / 45 tests.
- Production output: 408.82 kB initial raw / 99.70 kB transferred. Datepicker, table, modal, toast, and their generated source remain lazy chunks. CSS budget warnings remain: Home 7.94 kB, showcase 7.09 kB, Select demo 4.74 kB (4 kB warning, 8 kB error).
- Browser screenshots were inspected but not saved as repo files. The required 1920×1080, 1440×900, 1366×768, 390×844 language/theme matrix, Axe/Lighthouse, and full responsive/keyboard/reduced-motion matrix were not verified in this step.

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

## R3 evidence

- Showcase tabs and the moving indicator derive their count and position from `SHOWCASE_PACKAGES`; the mobile layout wraps into two columns below 640px and hides package IDs. The manifest has a colocated test limiting visible showcase packages to six.
- The preview is capped at 27rem and vertically centered. Measurements of the actual demos set a stable preview stage to 33rem at 640px and wider, and 41rem below 640px: the tallest Table preview measured 464px plus 64px block padding at 768px/1440px, 540px at 390px English, and 582px at 390px Arabic. The preview stays stable while changing all five tabs.
- Browser check on port 4200 at 360, 390, 640, 768, 1100, 1280, and 1440px found no page-width overflow or JavaScript errors. At 390px, Code mode remains within the 356px content width. The package tabs and pane headings remained at stable document positions while switching packages.
- `npm run verify`: passed (9 test files, 34 tests). Existing CSS budget warnings remain: showcase 6.40 kB and Home 6.52 kB against the 4 kB warning budget; neither reaches the 8 kB error budget.
- R3 production build: initial 398.78 kB raw / 99.27 kB transferred; Home lazy chunk 50.02 kB raw / 11.01 kB transferred.

- `docs/screenshots/revision/r3-1440x900-en-light.png`
- `docs/screenshots/revision/r3-390x844-en-light.png`

## R4 evidence

- Audited the installed `@rivinia/select@1.0.3` declarations and README. `RiviniaSelect` owns option filtering and selected single/multi IDs; its public API does not expose popup `open` or active-option state. The demo clearly labels those as example-owned state and reads selected IDs from the real package controller. The ready-made view remains the real `RiviniaSelectComponent` from `@rivinia/select/ui`.
- Rebuilt the custom view as a labeled searchable combobox/listbox with a check indicator, removable chips, enabled-option arrow navigation, Enter selection, Escape and focus-leave closing, and single-close/multi-stay-open behavior. The live state panel shows current `open`, active option, and controller-selected IDs. Search and selection use the package API; no library files or public APIs changed.
- The installed UI typings have no animation input or Angular enter/leave animation API. The existing premium UI path remains unchanged; the custom list uses CSS `@starting-style`, a bounded 16rem listbox, and reduced-motion handling.
- Browser review on port 4200 verified multi selection, chip removal, filtering, active-descendant navigation, Escape, single-mode closing, return to the genuine UI view, Arabic RTL in dark theme, and no horizontal overflow at 390px or 1440px. No page errors occurred. The list now expands in document flow so it does not cover the live state panel.
- `npm run verify`: passed (10 test files, 38 tests). CSS budget warnings remain at showcase 6.40 kB, Home 6.52 kB, and Select demo 4.74 kB (4 kB warning / 8 kB error budgets).
- R4 production build: initial 398.77 kB raw / 99.27 kB transferred; Home lazy chunk 50.02 kB / 11.01 kB. Select component, generated source, and registry total 85.33 kB raw / 18.93 kB transferred, up 16.78 kB raw / 3.06 kB transferred from R3; these remain in lazy chunks.
- New Arabic strings for review: «إظهار الخيارات», «إخفاء الخيارات», «إزالة {label}», «الحالة من طبقة Headless», «يتولى @rivinia/select الفلترة والقيم؛ ويتولى هذا المثال حالة القائمة والخيار النشط.», «مفتوحة», «الخيار النشط», «معرّفات محددة», «لا يوجد».

- `docs/screenshots/revision/r4-1440x900-en-light.png`
- `docs/screenshots/revision/r4-390x844-en-light.png`
- `docs/screenshots/revision/r4-390x844-ar-dark.png`

## R5 evidence

- Replaced the eager showcase import with a dynamic component import. It is prefetched with `requestIdleCallback` (with a delayed fallback) and instantiated when the Experience host enters the viewport. Decisions and Get Started remain eager.
- The host and its single-root static skeleton reserve matching block sizes. Browser review measured 1430.4px at a 360px viewport, 1321.9px at 768px, and 1196px at 1280px and 1440px; the initial placeholder exactly matched its 360px host measurement. The showcase appeared after scrolling it into view. The loading state stays visible for at least 100ms and switches to a localized retry state at 300ms if the import has not completed.
- The section reveal runs once for 240ms only while it has not been scrolled past; reduced motion disables the animation. The host reports loading with `aria-busy`, and the loading announcement and retry state are localized in English and Arabic.
- Browser review at CSS viewports 360×800, 768×900, 1280×900, and 1440×900 showed matching document/client widths (no horizontal overflow). English light/dark and Arabic RTL dark layouts were visually inspected. Browser screenshots were captured for inspection in the CUA session but are not stored as repository image files.
- `npm run verify`: passed (10 test files, 38 tests); architecture and generated-source checks passed. Existing component CSS warnings remain below the 8 kB error budget: Home 7.78 kB, showcase 6.40 kB, and Select demo 4.74 kB.
- R5 production build: initial 398.77 kB raw / 99.30 kB transferred (R4: 398.77 / 99.27); Home lazy chunk 35.90 / 8.55 kB (R4: 50.02 / 11.03), down 14.12 / 2.48 kB; new lazy Experience chunk 19.89 / 4.98 kB.

## R6 evidence

- Replaced the Decisions list and numbered diagram with the Four Pillars composition. The central diagram reuses all four existing brand-mark path pairs and the core geometry; each card highlights its matching petal on hover and keyboard focus. The SVG is hidden from assistive technology, and card content remains the accessible source of meaning. Reduced-motion disables petal transitions.
- At desktop widths, cards follow the specified clockwise start/end positions around the 22rem mark. Tablet uses a centered 14rem mark above a two-by-two grid; mobile uses a 10rem mark above one card column. Visual review at 360×800, 768×900, 1280×900, and 1440×900 showed no visible horizontal overflow.
- Reviewed English dark (mobile and desktop), English light (desktop), and Arabic RTL light (mobile and desktop). The Arabic grid mirrored the intended start/end card positions. Screenshots were captured in the browser session for inspection but are not persisted in the repository.
- Narrowed performance copy to verified package metadata: the five installed package manifests expose separate root and `./ui` entries and declare `sideEffects: false`; the showcase examples are lazy-loaded by the R5 implementation. Accessibility copy describes the documented ready-UI behavior and explicitly assigns markup/focus choices to headless consumers. Both claims are recorded in `docs/home-open-questions.md`.
- `npm run verify`: passed (11 test files, 40 tests). Prettier, architecture check (0 exceptions), generated-source check, production build, and non-watch tests all passed. Existing CSS budget warnings remain for the Home (7.93 kB), showcase (6.40 kB), and Select demo (4.74 kB) stylesheets; all are below the 8 kB error budget.
- R6 build: initial 398.98 kB raw / 99.33 kB transferred; Home lazy chunk 42.16 kB / 9.71 kB; Experience remains separate at 19.88 kB / 4.98 kB.
