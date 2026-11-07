You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Architecture and file placement

- Keep layers in this order: `core <- shared <- layout <- features <- pages <- app`. A layer may import its own layer and anything to its left; never import to the right. Composition roots (`app.config.ts`, `app.providers.ts`, `app.routes.ts`) live directly under `src/app/` and may import from any layer.
- Group code by feature. Put showcase demos in `src/app/features/showcase/demos/<package>/` with `<name>-example.component.ts`, `.html`, `.css`, and `.spec.ts` together when a spec exists.
- Keep component `templateUrl` and `styleUrl` relative to the component file and shaped as `./<name>.component.html` and `./<name>.component.css`.
- Keep generated showcase output only in `src/generated/`. Ignore it in Git, never edit it by hand, and let the existing `prestart`, `prebuild`, and `pretest` hooks generate it. Run `npm` scripts; do not invoke raw `ng` commands.
- Keep one package manifest with only existing metadata: `id`, `name`, `translationKey`, and optional `componentsPage` and `showcase` visibility. Keep site navigation separate; do not invent status or route fields.
- Co-locate each spec beside the file it tests. Do not create `tests/` folders under `src/app/`.
- Keep app-shell files named `app.ts`, `app.html`, and `app.css`; any rename is deferred.
- Follow one filename suffix per artifact: `.component.ts/.html/.css`, `.service.ts`, `.directive.ts`, `.model.ts`, and `.spec.ts`. Keep component class and selector names aligned with their filenames.
- Put reusable helpers in `shared/utils` when they serve multiple feature surfaces; `code-highlight` is shared by the reusable code block used in the hero, showcase, and Get Started.

## Adding a page

1. Put the page under `src/app/pages/<page>/` and keep its component files together.
2. Import only `core`, `shared`, `layout`, or `features` dependencies and page-local code.
3. Add a `loadComponent` route in `src/app/app.routes.ts`; add a navigation entry only when the page belongs in site navigation.
4. Add a co-located spec when the behavior needs coverage, then run `npm run verify`.

## Adding a demo or package

1. Put the demo files in `src/app/features/showcase/demos/<package>/` and use component-relative template/style URLs.
2. Add its files to `scripts/generate-showcase-sources.mjs`; keep visitor-facing source copyable and free of app-local imports.
3. Add the package to the single package manifest, setting only the applicable `componentsPage` and/or `showcase` visibility.
4. Register its showcase loader and visible example metadata; preserve lazy loading.
5. Add a co-located spec when warranted and run `npm run verify`.

## Verification and completion

- Before finishing a change, run `npm run verify`. It checks formatting, architecture, generated-source freshness, production build, and non-watch tests.
- Keep `scripts/check-architecture.mjs`'s temporary allowlist empty after Phase 2 migration.
- Treat adding `angular-eslint` or another lint dependency as a separate, explicit future decision; do not add it as part of architecture cleanup.
- Definition of done: `npm run verify` passes, no architecture rule is violated, and the requested scope is complete.

## Do not

- Do not add upward imports, hand-edit generated files, or add dependencies without approval.
- Do not change behavior or visuals during structure-only migration.
- Do not rewrite app-shell filenames, public APIs, or routing architecture as part of file organization.

## Home rules

- For every Home change, follow the revision requirements R1–R9 in `docs/home-ux-spec.md` and the execution checklist in `.agents/skills/rivinia-docs-home-ux/SKILL.md`.
- Keep one source for section/package data, verify every user-facing claim against repository evidence, and record removed claims in `docs/home-open-questions.md`.
- Keep Home and showcase content in the document flow: no nested scrolling except the Select listbox (maximum block size 16rem); use logical CSS properties, reduced-motion handling, and stable layouts.
- Preserve genuine package behavior, keyboard access, visible focus, localization, RTL, and both themes. Use shared code/copy components consistently and keep code readable without horizontal scrolling.
- Inspect the required viewport, language, and theme matrix in a browser; run `npm run verify` after each revision step and record evidence in `docs/home-revision-log.md`.
