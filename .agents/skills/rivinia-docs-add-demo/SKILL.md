---
name: rivinia-docs-add-demo
description: Add a Rivinia package demo to the showcase using its feature folder, generator, package manifest, lazy loader, and verification workflow.
---

# Add a Rivinia Docs demo

## When to use

Use this skill when adding a package to the interactive homepage showcase or adding another example for an existing package.

## Instructions

1. Read `AGENTS.md`, `scripts/generate-showcase-sources.mjs`, `src/app/features/showcase/interactive-showcase.component.ts`, and the package manifest.
2. Create `src/app/features/showcase/demos/<package>/<name>-example.component.ts`, `.html`, and `.css`. Put a related spec beside these files as `<name>-example.component.spec.ts`.
3. Use component-relative `templateUrl: './<name>-example.component.html'` and `styleUrl: './<name>-example.component.css'`.
4. Use the actual `@rivinia/<package>` API and imports. Keep the live preview behavior genuine and do not introduce app-local imports into visitor-facing snippets.
5. Register the source files in `scripts/generate-showcase-sources.mjs`. The generator owns generated output; never edit generated files by hand.
6. Add or update the single package manifest entry using only `id`, `name`, `translationKey`, and applicable `componentsPage` / `showcase` visibility fields. Do not invent status or route data.
7. Register a lazy loader and showcase metadata in `features/showcase`; do not eagerly import the example component into the app shell.
8. Add translations for every visitor-facing string in both supported languages.
9. Add a focused co-located spec when behavior needs coverage.
10. Run `npm run verify`; inspect and fix the first failing gate before continuing.

## Checklist

- [ ] Demo files are grouped in the package folder.
- [ ] Component assets use sibling `./` paths.
- [ ] Generator inputs and lazy showcase registration are updated.
- [ ] Manifest visibility is correct for each page.
- [ ] Public code examples use accurate package APIs and no app-local identifiers.
- [ ] Translations, spec, and `npm run verify` are complete.
