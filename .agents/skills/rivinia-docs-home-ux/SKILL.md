---
name: rivinia-docs-home-ux
description: Apply the approved Rivinia Docs homepage composition, content, accessibility, motion, and review requirements.
---

# Rivinia Docs home UX

## When to use

Use when implementing, reviewing, or adjusting the Rivinia Docs home page and its showcase composition.

## Instructions

1. At the start of each revision step, reread `AGENTS.md` and all `rivinia-docs-*` skills. Read `docs/home-ux-spec.md` and inspect repository evidence before displaying claims.
2. Follow every active R1–R9 requirement in `docs/home-ux-spec.md`; this revision contract supersedes earlier conflicting composition rules.
3. Keep every visible string localized in English and Arabic, preserve RTL/themes and actual package behavior, and honor keyboard access, visible focus, 44px targets, and reduced motion.
4. For every Home code and copy action, use the shared code-block/copy-button components. Keep helpers in `shared/utils` when they serve multiple feature surfaces; the shared code block uses `code-highlight` across Home and showcase.
5. After every step, run `npm run verify`, inspect the rendered result on port 4200, record the result and commit in `docs/home-revision-log.md`, and commit only that step.
6. Capture all required viewports/languages/themes under `docs/screenshots/revision/`; report contrast, bundle sizes, Lighthouse availability, and every unverified check honestly.
7. Finish with `docs/home-revision-report.md` using the exact headings in the revision contract; never treat a successful build as visual evidence.

## Checklist

- [ ] R1–R9 are implemented or explicitly reported as blocked/not verified.
- [ ] No nested Home/showcase scroll exists except the Select listbox.
- [ ] Shared code/copy UI covers all Home code and copy actions.
- [ ] Genuine Select behavior and manifest-driven package tabs remain functional.
- [ ] `npm run verify` passes after each commit and browser evidence is recorded.
