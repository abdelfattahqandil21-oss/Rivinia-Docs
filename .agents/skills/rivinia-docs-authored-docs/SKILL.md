---
name: rivinia-docs-authored-docs
description: Author library documentation pages, verified scenarios, and runnable examples for Rivinia Docs.
---

# Authored library docs

1. Read `docs/authored-docs-spec.md` before adding content, examples, navigation, or content tooling. It defines schema, directives, priorities, and acceptance.
2. Verify claims against installed 1.0.4 files and committed `_library-source` references. Each page declares nonempty existing `sources`. Keep source material immutable and outside application imports.
3. Author scenarios in `src/content/docs/<pkg>/`. Use frame mode for document-root or storage behavior and component mode for scoped UI. Frame HTML may reference same-folder CSS/JS for distinct source tabs; the build inlines only these local assets into the sandbox. Display real example files, compile TypeScript, and test logic files.
4. Generate structured AST and examples at build time. Render with generic Angular components. Keep marked in build scripts and UI chrome translated in both locales.
5. Complete pages in specification priority order. Run `npm run verify` after each step. Allow three repair attempts, then safely revert only that step and log BLOCKED with the exact error.
6. Record decisions in `docs/decisions-log.md`, steps in `docs/authored-docs-log.md`, and evidence in `docs/authored-docs-report.md`. Commit completed steps; never push or modify package code.
