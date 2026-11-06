---
name: rivinia-docs-home-ux
description: Apply the approved Rivinia Docs homepage composition, content, accessibility, motion, and review requirements.
---

# Rivinia Docs home UX

## When to use

Use when implementing, reviewing, or adjusting the Rivinia Docs home page and its showcase composition.

## Instructions

1. Read `AGENTS.md` and `docs/home-ux-spec.md`; verify repository facts before showing claims.
2. Keep the page to Hero, Experience, Decisions, and Get started with footer; preserve CSR, lazy routes, i18n, RTL, and genuine package demos.
3. Use the specified type scale, semantic theme tokens, spacing, section geometry, and responsive layout. Use the existing language/theme controls.
4. Keep controls keyboard-operable, labeled, at least 44px, visibly focused, and usable with reduced motion.
5. Keep claims linked to repository or package evidence. Record omitted/unverified claims in `docs/home-open-questions.md`.
6. Run `npm run verify` after each implementation step. Inspect rendered output in a browser and review the specified viewport, theme, and language matrix where tools allow.
7. Write evidence and limitations in `docs/overnight-report.md`; never report a build as visual proof.

## Checklist

- [ ] Four sections match the approved copy and order.
- [ ] Real Select and other package demos remain functional.
- [ ] English/Arabic, LTR/RTL, light/dark, keyboard, focus, and reduced motion are covered.
- [ ] No horizontal overflow or layout shift on demo changes.
- [ ] `npm run verify` passes and browser evidence is recorded.
