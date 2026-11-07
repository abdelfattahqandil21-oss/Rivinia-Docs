# Home revision log

Each entry records the local timestamp, step, status, commit, and one-line result. The commit field is filled after the step commit; no history is rewritten to backfill it.

| Timestamp (Africa/Cairo) | Step                        | Status | Commit  | Result                                                                                                                           |
| ------------------------ | --------------------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-07 12:12 EET     | Step 0 — audit and contract | DONE   | pending | Captured 8 baseline screenshots (1440×900 and 390×844, EN/AR, light/dark); no horizontal page overflow in any captured viewport. |

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
