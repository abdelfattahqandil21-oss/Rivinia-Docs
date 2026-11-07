---
name: rivinia-docs-architecture
description: Apply Rivinia Docs layer, placement, naming, and import-direction rules when changing Angular app structure.
---

# Rivinia Docs architecture

## When to use

Use this skill when adding or moving application code, reviewing imports, or deciding where a Rivinia Docs file belongs.

## Instructions

1. Read the root `AGENTS.md` and identify the source and destination layers.
2. Keep the order `core <- shared <- layout <- features <- pages <- app`: an item can import itself or anything to its left, never to its right. Composition roots (`app.config.ts`, `app.providers.ts`, `app.routes.ts`) live directly under `src/app/` and may import from any layer.
3. Group by feature. Put a showcase demo in `src/app/features/showcase/demos/<package>/` with its TypeScript, HTML, CSS, and spec together.
4. Keep generated source under `src/generated/`, ignored and generator-owned. Generated demo sources may be imported only from `features/showcase`; generated package metadata may be imported only by `features/packages/package-metadata.ts`.
5. Keep component asset paths relative to the component file: `./<name>.component.html` and `./<name>.component.css`.
6. Put a helper in `shared/utils` when multiple feature surfaces use it; keep `code-highlight` there because the reusable code block serves the hero, showcase, and Get Started.
7. Keep app shell files named `app.ts`, `app.html`, and `app.css` until a separate decision approves renaming.
8. Preserve CSR and existing `loadComponent` routes. Do not make structural work change runtime behavior or visuals.
9. Use `git mv` for approved file moves and stage only the files in the current step.
10. Run `npm run verify` after each approved step. Never run raw `ng` commands.

## Checklist

- [ ] Destination follows the layer and feature rules.
- [ ] Imports point only to the same or a leftward layer.
- [ ] Template and style URLs use `./` sibling paths.
- [ ] Specs stay co-located; no `tests/` folder is introduced.
- [ ] No generated file was hand-edited.
- [ ] `npm run verify` passes.
