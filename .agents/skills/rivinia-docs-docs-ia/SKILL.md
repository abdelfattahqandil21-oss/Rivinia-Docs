---
name: rivinia-docs-docs-ia
description: Build or review the Rivinia Docs hub, package overviews, getting-started pages, navigation, tokens, and localized documentation content.
---

# Rivinia Docs information architecture

## When to use

Use this skill when changing the Docs hub, package documentation routes, Docs sidebar/navbar context, documentation prose, or Docs color rules.

## Instructions

1. Read `AGENTS.md`, this skill, and `docs/docs-ia-spec.md` before each Docs implementation step. Re-read the other `rivinia-docs-*` skills as required by the task log protocol.
2. Verify all package descriptions, versions, exports, dependencies, and demo availability from the installed package manifests and repository sources. Keep the package manifest as the single source for Docs grouping and visibility.
3. Keep Docs routes lazy under `features/docs`, use `docsLink(...)` for destinations, preserve one app-shell `<main>`, and use the layout-owned context service for navbar integration.
4. Localize every visible string in English and Arabic. Docs and any new UI use existing design tokens only; no color literals or new hues.
5. Preserve actual copy and examples. Render a block only when verified data exists; record gaps in `docs/docs-coverage.md`.
6. Run the requested checks and browser review at each step, log exact evidence in `docs/docs-ia-log.md`, and commit one step at a time. Never push as part of this task.

## Checklist

- [ ] Routes, shell, sidebar, page rail, and mobile dialog follow the specification.
- [ ] Package facts and examples are backed by installed metadata or repository sources.
- [ ] Translation keys exist in both locale files; RTL, themes, focus, and reduced motion work.
- [ ] Docs colors use existing tokens only and contrast results are recorded.
- [ ] Verification and browser evidence are accurately reported.
