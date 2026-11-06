# Architecture Audit — Phase 0

**Scope:** read-only review of the current `src/`, `scripts/`, path configuration, and the architecture rules proposed for this application. No source files were changed as part of this audit. The report itself is the requested Phase 0 deliverable.

**Worktree note:** the audit was performed with pre-existing uncommitted changes present. In particular, showcase examples currently appear under `examples/components/`, `examples/templates/`, `examples/styles/`, `examples/tests/`, and `examples/generated/`, alongside tracked-file deletions for the former flat example files. These changes were left intact. The untracked root `tree.txt` was also left untouched.

## 1. Inventory

### `src/` tree

```text
src/
├── app/
│   ├── app.config.ts
│   ├── app.css
│   ├── app.html
│   ├── app.routes.ts
│   ├── app.spec.ts
│   ├── app.ts
│   ├── core/
│   │   ├── config/
│   │   │   ├── navigation.ts
│   │   │   └── third-party.config.ts
│   │   ├── guards/                         # empty
│   │   ├── models/
│   │   │   ├── nav-link.model.ts
│   │   │   └── theme-mode.model.ts
│   │   └── services/
│   │       ├── progress-bar.service.ts
│   │       ├── reveal-transition.service.ts
│   │       ├── theme.service.spec.ts
│   │       └── theme.service.ts
│   ├── pages/
│   │   ├── components/
│   │   │   ├── components-page.component.{css,html,ts}
│   │   │   ├── models/component-package.model.ts
│   │   │   └── services/component-packages.service.ts
│   │   ├── docs/docs-page.component.{css,html,ts}
│   │   ├── guides/guides-page.component.{css,html,ts}
│   │   ├── home/
│   │   │   ├── home-page.component.{css,html,ts}
│   │   │   └── showcase/
│   │   │       ├── interactive-showcase.component.{css,html,spec.ts,ts}
│   │   │       ├── showcase-code-highlight.{spec.ts,ts}
│   │   │       ├── showcase-example.model.ts
│   │   │       ├── showcase-icu.spec.ts
│   │   │       └── examples/
│   │   │           ├── components/{datepicker,modal,select,table,toast}-example.component.ts
│   │   │           ├── generated/{datepicker,modal,select,table,toast}-example.source.generated.ts
│   │   │           ├── styles/{datepicker,modal,select,table,toast}-example.component.css
│   │   │           ├── templates/{datepicker,modal,select,table,toast}-example.component.html
│   │   │           └── tests/table-example.component.spec.ts
│   │   └── playground/playground-page.component.{css,html,ts}
│   └── shared/
│       ├── components/
│       │   ├── brand-mark/brand-mark.component.{css,html,ts}
│       │   ├── github-link/github-link.component.{css,html,ts}
│       │   ├── icon/{icon-registry.ts,icon.component.css,icon.component.html,icon.component.ts}
│       │   ├── navbar/navbar.component.{css,html,spec.ts,ts}
│       │   ├── page-header/page-header.component.{css,html,ts}
│       │   ├── preferences-menu/preferences-menu.component.{css,html,ts}
│       │   └── progress-bar/progress-bar.component.{css,html,ts}
│       └── directives/progress-bar/progress-bar.directive.ts
├── environments/{environment.model.ts,environment.prod.ts,environment.ts}
├── index.html
├── main.ts
└── styles.css
```

### `scripts/` tree

```text
scripts/
└── generate-showcase-sources.mjs
```

### Path/configuration files

- `angular.json`: browser entry is `src/main.ts`; global CSS is `src/styles.css`; `public/` is copied as assets; production environment replacement points at `src/environments/`. Build output goes to ignored `builds/` paths. CSR routes are configured in application code, not server-rendering targets.
- `tsconfig.json`: references `tsconfig.app.json` and `tsconfig.spec.json`; no `baseUrl` or `paths` aliases are configured.
- `tsconfig.app.json`: includes `src/**/*.ts`, excludes specs.
- `tsconfig.spec.json`: includes declaration files and `src/**/*.spec.ts`.
- `package.json`: `start`, `build`, and `test` use Angular CLI. `prestart`, `prebuild`, and `pretest` run the source generator. `verify:showcase-sources` runs its check mode. **There is no lint script.**
- `.gitignore`: ignores build output, Node dependencies, Angular cache, coverage, and common local files. Generated showcase files are **not** ignored.
- `.prettierrc`: 100-column width, single quotes, Angular HTML parser override.
- No ESLint configuration or Angular lint target was found at the repository root. No additional path-alias config was found.

## 2. Generated showcase source

`scripts/generate-showcase-sources.mjs` uses a hard-coded list in this order: `select`, `datepicker`, `table`, `modal`, `toast`. For each name it reads exactly three UTF-8 files from the current directory structure:

- `src/app/pages/home/showcase/examples/components/<name>-example.component.ts`
- `src/app/pages/home/showcase/examples/templates/<name>-example.component.html`
- `src/app/pages/home/showcase/examples/styles/<name>-example.component.css`

It serializes those complete strings as `{ html, typescript, css }`, formats a TypeScript `export const <name>ExampleSource = ... as const` with Prettier, and writes to `src/app/pages/home/showcase/examples/generated/<name>-example.source.generated.ts`. With `--check`, it compares the generated text to the existing output and throws `Showcase source is stale: <path>` on mismatch. The npm lifecycle hooks run write mode before start, build, and test; the explicit verify script runs check mode. The generator does not discover files dynamically, normalize paths, strip internal imports, or transform the source for copy/paste use.

Inspection of all five current generated payloads confirms that the displayed TypeScript strings retain app-internal paths. Each contains `templateUrl: '../templates/<name>-example.component.html'` and `styleUrl: '../styles/<name>-example.component.css'`; these resolve only in the app's split-folder layout and are not a self-contained consumer example. The Select payload also contains imports from `../../showcase-code-highlight` and `../../showcase-example.model`, which are documentation-app implementation details. The generator currently preserves those verbatim. This is a code-documentation accuracy issue: visitors copying the generated component source do not have those app-local paths/files in their project. The TS payload is the complete current component file, not a curated usage example; Select separately appends hand-authored `SELECT_EXAMPLE_CODE_BLOCKS` in its loader.

The desired `src/generated/` location and gitignore behavior are not current behavior. Moving output requires coordinated changes to generator paths, dynamic imports, tsconfig inclusion, ignore rules, and build/test lifecycle validation.

## 3. Duplicated package/page metadata

- `src/app/core/config/navigation.ts` defines four internal navigation entries (`/docs`, `/components`, `/playground`, `/guides`) with translation keys, and one external GitHub link. `app.routes.ts` separately defines those route paths and titles. This duplicates route identity at the nav/route boundary, but navigation contains no Rivinia package list, status, package descriptions, or per-package docs URLs.
- `src/app/pages/components/models/component-package.model.ts` is the components page's package list: `@rivinia/env`, `@rivinia/http`, `@rivinia/i18n`, `@rivinia/select`, and `@rivinia/theme`, each with a translation key. `ComponentPackagesService` exposes this constant through a signal; only `ComponentsPageComponent` consumes the service in the current app.
- `EXAMPLES` in `src/app/pages/home/showcase/interactive-showcase.component.ts` separately lists `@rivinia/select`, `@rivinia/datepicker`, `@rivinia/table`, `@rivinia/modal`, and `@rivinia/toast` with showcase ids. The showcase template uses each entry's `packageName`; labels are translated through `showcase.<id>.name`.
- The lists overlap on `@rivinia/select` but differ in membership by purpose. The components page's five entries and showcase's five entries are not duplicate copies of one identical list; they represent different page scopes. A future single manifest must model those distinctions explicitly (for example, package identity plus independent page/showcase visibility), rather than force the pages to show the same set.
- No package status or route metadata appears in either list. The showcase docs link currently goes to `/components` for every package, not to package-specific docs. Avoid claiming these fields are duplicated when they are not present.

## 4. Dependency direction and cycles

Observed application imports follow these layer relationships:

- `app` imports `core`, `shared`, and page routes.
- `pages` imports `shared` and page-local modules. Home owns the showcase; showcase imports the shared icon component and its own example modules.
- `shared` imports `core` models/config/services where needed: navbar and GitHub link import navigation config; preferences menu imports theme/reveal services and theme model; progress directive imports the progress service.
- `core` imports only core-local models/services except `core/config/third-party.config.ts`, which imports `appIcons` from `shared/components/icon/icon-registry.ts`. This is a dependency from `core` into `shared`, an upward dependency under the proposed `core <- shared <- features <- pages` rule. It is used to register icons in app-level third-party setup.
- No `shared -> pages` imports were found. The current showcase imports `shared`; its examples import showcase-local types/highlighter. No import cycle was evident in the inspected static imports. A move of showcase into `features/` must retain one-way `features -> shared/core` references and avoid moving shared helpers under that feature.

## 5. Progress bar ownership and use

| File                                                                                   | Responsibility                                                | Current consumer                                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/app/core/services/progress-bar.service.ts`                                        | Signal state, trickle timer, complete/fail/reset              | App shell and progress directive                                                  |
| `src/app/shared/components/progress-bar/progress-bar.component.ts` plus `.html`/`.css` | Presentational bar; value/visibility/label inputs             | `App` imports it; used by `src/app/app.html`                                      |
| `src/app/shared/directives/progress-bar/progress-bar.directive.ts`                     | Starts/completes/fails progress from clicks and router events | `App` imports it; `[appProgressBar]` is on the progress-bar element in `app.html` |
| `src/app/app.ts` / `src/app/app.html`                                                  | Wires service signals to component and attaches directive     | Application shell                                                                 |

The implementation is split across core service, shared component, and shared directive. The dependency from shared directive to core service is intentional for runtime behavior; consolidation should preserve that contract and avoid changing router/click semantics.

## 6. Dead code and unused structures

- `src/app/core/guards/` is empty.
- `ComponentPackagesService` and its model/constant are used by one page only; they are not dead, but could be simplified or relocated during a scoped architecture change.
- `ShowcaseExampleSource` legacy `html`, `typescript`, and optional `css` fields are used by the generic Code pane; `codeBlocks` extends it for Select. No dead-field conclusion is made from the current evidence.
- `ShowcaseExampleLoaders` is injectable specifically to support the showcase loader and tests; it is used.
- No definite unused application export was established by this static review. TypeScript exports and Angular metadata need compiler-aware analysis before removal. Generated outputs are consumed by the showcase lazy loaders and are not dead.

## 7. Tests and placement

Specs are discovered through `src/**/*.spec.ts`. Current specs include app, theme service, navbar, interactive showcase, showcase ICU, code highlighter, and table example. Most are co-located with their source or feature folder. The table example spec is under `examples/tests/` while its implementation is under `examples/components/`; this is the one clear tests-folder inconsistency. No tests are under a separate top-level test tree. Moving demos by package should co-locate each spec with its component as requested.

## 8. Naming observations

- App shell files intentionally use `app.ts`, `app.html`, and `app.css`; the requested choice to rename them to `*.component.*` is deferred and remains an open question.
- Most UI components use `<name>.component.ts/html/css` and classes ending in `Component`; service files use `<name>.service.ts`; directive uses `<name>.directive.ts`; specs use `.spec.ts`.
- Example assets currently use three type-named sibling folders (`components/`, `templates/`, `styles/`) and a separate `tests/` folder, while the component metadata points to `../templates/...` and `../styles/...`. This differs from the proposed cohesive per-package demo folder.
- `showcase-code-highlight.ts` is a utility with a feature-specific name and currently resides in the showcase folder. Whether it belongs in `shared/utils` depends on reuse; current use is within showcase only (interactive showcase and Select example), so moving it to generic shared utilities is not justified by multi-page reuse evidence alone.

## 9. Risks to proposed changes

| Proposed change                                            | Main risks                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Move each demo into a package folder                       | Relative `templateUrl`/`styleUrl`, lazy dynamic-import paths, generator input paths, generated output paths, spec imports, and Angular source discovery can break together. Existing uncommitted example restructuring must be treated as the starting tree, not overwritten.    |
| Normalize code shown to visitors                           | Must distinguish copyable public usage from the app's full component implementation. Naive text replacement can leave invalid imports, omit required state, or falsely claim a snippet is runnable. Keep runtime demo behavior untouched.                                        |
| Move generated outputs to `src/generated/` and ignore them | Clean checkouts need lifecycle hooks to generate files before Angular compilation. Ignored generated files may be absent in direct `ng build`/`ng test` calls. CI and editor TypeScript language service behavior need validation; dynamic imports and verify script must agree. |
| Move showcase shell to `features/showcase`                 | Home page imports, lazy example imports, showcase specs, import paths, and source generator paths need coordinated updates. Preserve `loadComponent` CSR routes and lazy example loaders.                                                                                        |
| Consolidate progress-bar files                             | App imports/template wiring, directive-to-service provider visibility, relative paths, and router/click timing can regress. Keep component styling and selector behavior unchanged.                                                                                              |
| Create one package manifest                                | Current lists have distinct membership and only partial shared metadata. An overly rigid schema can change what the pages show or cause missing translations/routes. Existing package-specific docs routes do not exist. Define optional page/showcase roles before migration.   |
| Co-locate specs/delete empty folders/move helpers          | Spec discovery is glob-based, but imports and generator paths change. `showcase-code-highlight` currently has only feature-scoped use; moving it to shared creates a broader ownership claim without broader reuse.                                                              |
| Enforce a lint gate                                        | There is no current lint command, target, or config. The approved `npm run verify` substitutes Prettier and the Node architecture checker without adding a dependency; adding `angular-eslint` remains a separate explicit future decision.                                      |

## 10. Proposed target and migration sequence

The proposed structure below follows the requested feature grouping while preserving the current app shell and CSR routes. It is a proposal only; no files were moved in Phase 0.

```text
src/app/
├── app.{ts,html,css}
├── core/{config,models,services}/
├── layout/
│   ├── navbar/
│   ├── footer/                 # only if an existing footer is present/needed
│   ├── preferences-menu/
│   └── progress-bar/           # service + component + directive ownership
├── shared/
│   ├── components/{brand-mark,github-link,icon,page-header}/
│   └── utils/                  # only genuinely cross-feature helpers
├── features/
│   └── showcase/
│       ├── interactive-showcase.component.{ts,html,css,spec.ts}
│       ├── showcase-example.model.ts
│       ├── showcase-code-highlight.{ts,spec.ts}
│       └── demos/
│           ├── select/select-example.component.{ts,html,css,spec.ts}
│           ├── datepicker/datepicker-example.component.{ts,html,css}
│           ├── table/table-example.component.{ts,html,css,spec.ts}
│           ├── modal/modal-example.component.{ts,html,css}
│           └── toast/toast-example.component.{ts,html,css}
└── pages/{home,docs,components,guides,playground}/
```

Approved Phase 2 steps, each independently reviewable and reversible:

1. **Move demos by package.** Use `git mv` to move each current component/template/style/spec into `src/app/features/showcase/demos/<package>/`; update component URLs, loader imports, tests, and generator input paths. Keep generated output where it is in this step. Preserve public runtime behavior.
2. **Normalize visitor-facing source.** Rewrite displayed `templateUrl` and `styleUrl` to sibling paths. Identify every app-local import/identifier in displayed source and report how it will be handled; do not silently strip imports. Make the generator fail if app-local identifiers remain in visitor-facing source.
3. **Relocate generated files.** Move output to ignored `src/generated/`, update dynamic imports, `.gitignore`, formatting ignores, and retain lifecycle generation through npm scripts.
4. **Move showcase shell to `features/showcase`.** Update home imports, specs, and lazy loaders without changing route definitions or loading behavior. Keep `showcase-code-highlight` in this feature.
5. **Consolidate progress-bar ownership and fix icon direction.** Move progress service/component/directive together to `layout/progress-bar/`; move `icon-registry.ts` into `core/config`; update app wiring without changing behavior.
6. **Unify package metadata.** Add one manifest with only `id`, `name`, `translationKey`, and optional `componentsPage`/`showcase` visibility. Migrate the components page and showcase consumers; keep navigation separate.
7. **Finish placement cleanup.** Move navbar and preferences menu into `layout/`, delete empty `core/guards/`, and co-locate remaining specs. Keep `app.ts/app.html/app.css` naming deferred.

For each approved migration step, the approved gate is `npm run verify` before commit. The repository still has no ESLint setup; the agreed gate uses Prettier and the Node architecture checker without a new dependency. Phase 0 itself did not run these checks because it was a read-only audit and the request said to stop before Phase 1.

## Approved decisions and Phase 1 status

The user approved Phase 0 and resolved its open decisions before Phase 1:

- Use no new lint dependency. `npm run verify` runs Prettier check, architecture check, generated-source check, production build, then non-watch Vitest tests. Adding `angular-eslint` is a separate future decision.
- Generated sources will move to ignored `src/generated/` in Phase 2 Step 3 and remain produced by the existing npm lifecycle hooks. Use npm scripts; do not invoke raw Angular CLI commands.
- `features/` is approved; demo destinations are `src/app/features/showcase/demos/<package>/`. `showcase-code-highlight` stays in the showcase feature.
- Use one package manifest with only `{ id, name, translationKey, componentsPage?, showcase? }`; keep navigation separate and do not invent status or route fields.
- Keep `app.ts`, `app.html`, and `app.css` filenames unchanged for now.
- Fix the known core-to-shared import by moving `icon-registry.ts` into `core/config` in Phase 2 Step 5.

Phase 1 adds the root rules, project-local Codex skills under `.agents/skills/`, the Node-only architecture checker, and the `check:arch`/`verify` npm scripts. The checker allowlist temporarily covers only the violations tied to approved Phase 2 steps and must be empty at the end of Phase 2. No Phase 2 file moves are authorized before separate approval.
