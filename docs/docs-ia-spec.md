# Docs information architecture specification

## Purpose and boundaries

Build a multilingual documentation hub and shell for the eleven Rivinia packages. Preserve Angular CSR, lazy loading, package behavior, and public APIs. Use no new dependencies and do not edit `@rivinia/*` packages. Verify all package facts against the repository or the installed package metadata. Omit unavailable content and track it in `docs/docs-coverage.md`.

Every visible string must have English and Arabic translations. Keep technical identifiers and commands in Latin script. Use logical CSS, reduced-motion support, visible focus, WCAG 2.2 AA contrast, and interactive targets of at least 44px. Docs and new UI use existing semantic theme tokens only; no color literals or new hues.

Use the existing shared code block and copy control for every code snippet and copy action. If those components are unavailable, use existing implementations and record that limitation. Do not create replacement primitives.

## Verification and records

- Work on `feat/docs-ia`; make no pushes.
- At the start of each implementation step, reread `AGENTS.md` and all `rivinia-docs-*` skills. Log the step with timestamp, status, commit, and one-line result in `docs/docs-ia-log.md`.
- Run `npm run verify` after every step. Fix failures up to three attempts; then stop that step, record the exact blocker, and continue only with independent work. Preserve work; use a safe revert if rollback is required.
- Record decisions in `docs/decisions-log.md`; choose the smallest change and no new claim when uncertain.
- Use local Playwright or Lighthouse only when already available. Record unavailable checks as Not verified.

## Color unification

1. `docs/color-audit.md` inventories semantic token names, dark/light values and roles from `src/styles/tokens.css` and Home styles, maps Home usage by role, and lists every existing color literal in Docs UI source and its replacement.
2. Map Docs roles to existing tokens: page/surface/overlay, border, text/muted/link/link-hover, accent/contrast, focus, selection, inline code, code surface/border/syntax, active sidebar, table, scrollbar, and dialog backdrop. Derive a missing role only with alpha or `color-mix()` from an existing token; document every derivation. If no existing hue can satisfy a role, record it in `docs/home-open-questions.md`.
3. Docs styles use token references only. Reuse Home's syntax variables. Do not add gold to new roles. Set `color-scheme` by theme and use token-derived scrollbar colors.
4. Add Node-only `scripts/check-colors.mjs`; fail on color literals in `src/app/features/docs/**` and task-created UI files, and report other source counts into the audit. Allowlist token definition sources and the brand mark SVG. Add `check:colors` to verify.
5. Add Node-only `scripts/check-contrast.mjs` to calculate dark/light WCAG ratios for body, muted, links, accent text, syntax, active sidebar, focus, indicator and meaningful borders. Text needs 4.5:1; focus, active indicator and meaningful borders need 3:1. Record unparseable pairs and pre-existing failures. Only fail pairs introduced by this task. Support hex, rgb, hsl and oklch and resolve `var()` references.
6. Update Docs rules and its skill: existing tokens only, no color literals.

## Known-defect corrections

- Remove the visible Guides link; preserve `/guides` redirect to `/docs`.
- Add Node-only `check:i18n`: literal translation keys used by templates/code must exist in both locale files and locale key sets must match. Fix all current failures and add it to verify.
- Docs pages never render `<main>`; the application shell owns the single main landmark. Enforce this in the architecture checker.
- Use `routerLinkActive` with `ariaCurrentWhenActive="page"` for sidebar links. The page-level rail marks the heading in view with `aria-current="location"` through scroll spy; no static current state.
- Use the Home sans type scale for Docs headings and the Arabic font rules. Serif is reserved for the brand wordmark. Keep 48px between content sections rather than viewport-height Home sections.
- Remove the horizontally scrolling mobile Docs navigation when the navbar Docs menu is implemented.

## Package metadata

- Generate `src/generated/package-meta.generated.ts` from the installed package manifests: name, version, description, exported entry points, `hasUi` from `./ui`, Rivinia dependencies, and peer dependencies. Fail loudly if a manifest is missing. Extend existing lifecycle hooks without hand-editing generated output.
- Add only `docs.group` to the package manifest. Groups: foundations (`env`, `http`, `i18n`, `theme`), components (`select`, `datepicker`, `table`, `modal`, `toast`, `menu`), primitives (`popup`). If package descriptions do not support a group, use components and record why.
- Make `componentsPage` and `showcase` visibility explicit for all packages. Record whether `menu` and `popup` belong in the Components gallery. Use ICU pluralization for the data-driven Components count.
- Test that every manifest id has generated metadata, ids and translation keys are unique, and group values are valid.

## Routes and Docs shell

- Keep the existing site navbar. Do not duplicate it inside Docs.
- Put lazy Docs routes below `src/app/features/docs/`: `/docs` hub, `/docs/getting-started/:slug`, and `/docs/:package` overview. Reserve package suffixes `headless`, `ui`, `api`, and `examples` without adding those tabs now.
- Unknown package and getting-started slug render a localized not-found state inside the Docs shell and link to `/docs`.
- Use one `docsLink(...)` helper for Docs destinations. Latest pages have no version prefix. Document future major-version paths and banner/selector behavior in `docs/versioning-plan.md`; do not implement a selector now.
- Route title format: `{page} · {library} · Rivinia Docs`, localized. After route navigation, focus the page H1 (`tabindex="-1"`) and announce its title in a polite live region. Preserve a working skip link.
- At >=1280px use sidebar/content/right rail columns (16rem / max 48rem / 14rem). At 1024–1279px retain sidebar/content and move the rail into a content disclosure. Below 1024px the sidebar is a navbar-triggered drawer and the rail is a disclosure.
- Use the navbar height token for sticky top, scroll margin (+16px) and scroll padding. Sidebar may be the only nested scroll area, with contained overscroll, and should reveal the active item.

## Sidebar and responsive menu

- Show a flat `Getting started` group first, then manifest library groups. Never expand each library into a nested tree. Show package short names; version badges belong only on library page headers.
- When more than eight libraries exist, show a filter that filters names, clears on Escape, shows an empty state, and announces result count.
- Group headings stay plain labels unless a group exceeds ten items. Current page has a non-color-only visible indicator and `aria-current="page"`.
- Below 1024px, put a labeled, accessible 44px Docs menu button inside the existing navbar. Use a native `<dialog>` opened with `showModal()`, close on route change/Escape, and return focus to the trigger. Its backdrop uses the overlay token.
- Share Docs context from features through a small layout-owned signal service; navbar imports only from layout/core/shared, never from features. Inspect 390px LTR/RTL. If the button does not fit, move GitHub into the drawer footer on Docs routes only and record the decision. Ensure no horizontal overflow.

## Prose styles

Use one Docs prose stylesheet with token-only styles for h1–h4, paragraphs, lists, links, inline code, code blocks, kbd, tables, blockquotes, and rules. Use the Home scale, max 60ch text, and Arabic 1.8 line-height with no uppercase or letter spacing. Tables must not cause page overflow; wrap or stack cells. Heading anchors appear on hover/focus, copy deep links, expose accessible names, and announce copied feedback.

## Pages and content

### `/docs` hub

Show one H1, one verified introductory sentence, the shared package filter, a Getting Started entry, and compact library rows grouped by the manifest. A row may show package name, verified description, version, and a UI chip only when `hasUi`. Do not reuse Components gallery cards or use filler. Keep one primary CTA per viewport.

### Getting Started pages

Move the current Docs page's three sections to `/docs/getting-started/<slug>` in their existing order and preserve their copy. Slugs derive from stable English headings. Add previous/next navigation at the end of the sequence.

### Library overview

Render blocks only when their data exists, in this order:

1. Header with name, verified description, version badge (automatically “Pre-1.0” only for major zero), and entry-point chips.
2. `npm i <name>` only when publication is verified.
3. Public entry-point specifiers from exports only; do not invent identifiers.
4. Quick start only when a genuine generated showcase source exists; reuse that source and showcase normalization.
5. Rivinia dependencies/peer dependencies as links to their overview pages.
6. Two concise, verified Headless/UI sentences only when `hasUi`.
7. “See it live” only when the package has a real demo/gallery.

Render a library-section navigation only when at least two sections exist. Use native links with `aria-current="page"`, not tab roles. Build the page rail from rendered h2/h3 ids and an IntersectionObserver. Components gallery cards link to `/docs/:package`.

## Acceptance and report

Report each check as passed, failed, or Not verified. Verify the five-second task (“where am I, how find my library, what next”), keyboard route, focus behavior, one H1 and one main landmark, labeled navs, no stacked mobile bars, no horizontal overflow at 390px LTR/RTL, and no nested Docs scrolling except the sidebar. Capture screenshots at 1920×1080, 1440×900, 1280×800, 1024×768 and 390×844 in both directions and themes under `docs/screenshots/docs-ia/`. Run Lighthouse accessibility on `/docs` and one library page if tooling exists.

Create `docs/docs-coverage.md` with all eleven packages by the seven overview blocks. Final report is `docs/docs-ia-report.md` with Done (commit hashes), Blocked, Decisions, color/contrast findings, coverage gaps, every new Arabic string, Not verified, Prompt 2 inputs (public typings and demos), and next steps. End the report with a ten-line summary.
