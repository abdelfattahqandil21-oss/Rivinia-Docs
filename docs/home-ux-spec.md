# Rivinia Docs home UX specification

## Purpose and design direction

Direction: **The quiet instrument**. Rivinia is a focused set of Angular packages for developers who want to choose between headless behavior and a ready-made UI. The page should make that choice clear and let visitors try the real packages.

The five-second test: visitors can identify what Rivinia is, who it serves, and where to start from the hero copy alone. Use calm hierarchy, generous but purposeful spacing, neutral surfaces, restrained gold, and subtle purple only for meaning. Do not imitate another documentation site's visual identity.

Required composition: use a two-column desktop hero, a real Select preview, four evidence-backed decisions, and a three-step start/footer composition. Do not use image-led editorial layouts, empty product mockups, or motion that competes with the content.

## Page structure and global layout

Four sections in order: Hero, Experience, Decisions, Get started. The footer belongs inside Get started. Each section has one eyebrow, one heading, one supporting sentence, and its content.

Use a 72rem content maximum, inline padding `clamp(1rem, 4vw, 2rem)`, reading text no wider than 60ch, and a demo area no wider than 80rem. Sections use `min-height: calc(100svh - var(--navbar-height))`, centered grid alignment, block padding `clamp(4rem, 8vw, 7rem)`, and start scroll alignment. Taller sections grow and never clip. Use proximity scroll snapping, disabled below 640px, below 600px viewport height, and under reduced motion. Set scroll padding to the navbar height.

Spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Radius tokens: 8, 12, 16px. Keep existing semantic tokens where they work; only add the minimum neutral surface steps needed for base, raised, and overlay surfaces.

## Typography and accessibility

Self-host WOFF2 with `font-display: swap`: Inter variable for Latin UI/display, IBM Plex Sans Arabic at 400/500/700 for Arabic, and JetBrains Mono at 400/500 for code. Use unicode subsets and preload only the most-used Latin and Arabic files. Inter uses `cv11` and `ss01`; numeric UI uses tabular figures. Code stays `dir="ltr"` even in Arabic pages. Stacks: `'Inter', system-ui, sans-serif` and `'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif`.

Type scale: H1 `clamp(2.5rem, 1.5rem + 4vw, 4.5rem)`, 1.05 line height, 700 weight, -0.02em tracking, max 18ch. H2 `clamp(1.75rem, 1.2rem + 2vw, 2.75rem)`, 1.15 line height, 600 weight. Eyebrow 0.875rem/500, uppercase and 0.08em tracking in English only. Body 1.125rem/1.6; small text at least 0.875rem; code 0.9rem/1.6. Arabic uses 1.8 line height, no tracking, italics, or uppercase.

Meet WCAG 2.2 AA: normal text contrast at least 4.5:1 and large text 3:1, visible keyboard focus, full keyboard access, logical properties for RTL, and reduced-motion support. Interactive targets are at least 44px. Focus ring is 2px gold with 2px offset. Supporting copy is muted but remains readable. Keep the main message visible without interaction.

Use at most two visible control rows. Progressive disclosure is for implementation detail only. Every promise links to a live demo, docs, or repository evidence. Do not claim unverified performance, accessibility coverage, publication state, version, license, or compatibility.

## Visual language and motion

Reuse semantic colors. Gold is reserved for the primary CTA, focus, and one emphasis per section; CTA text is dark. Use faint low-alpha hairline borders, without heavy shadows. A radial mask may fade a faint dot/grid pattern; one soft gold radial glow may sit behind the hero code sample. Nothing else glows. Code panels have restrained window dots, filename, and language labels.

Sections may fade in and translate 8px over 240ms ease-out once as they enter view. No parallax or looping animation. Disable motion for `prefers-reduced-motion`.

## Hero

Job: explain the product in five seconds and offer a clear next action. Center vertically; desktop at 1024px and wider uses copy plus code columns, narrower layouts put copy first. Copy order: verified version/Angular badge only when both can be established; headline; supporting sentence; primary and secondary CTA; install/copy row only when package publication is verified; verified trust links only; scroll cue.

English headline: “Headless logic. Ready-made UI. Your choice.” Arabic: “منطق مستقل. واجهة جاهزة. والاختيار لك.” Supporting English: “Signal-based Angular packages. Behavior and accessibility live in a headless layer. Use it with your own markup, or add the matching UI package.” Arabic: “حزم Angular مبنية على الـ signals. السلوك وإمكانية الوصول في طبقة headless، استخدمها مع الـ markup الخاص بك أو أضف حزمة الواجهة الجاهزة.”

Primary CTA: “Get started” / “ابدأ الآن”. Secondary: “Explore components” / “استكشف المكوّنات”. Show the same real Select behavior in Headless and UI forms, static snippets no longer than eight lines each, based on demo source. Scroll cue links to Experience.

Backup headline options retained for consideration only: “Angular components without the styling fights.” and “Build your Angular design system on logic that's already solved.”

## Experience

Eyebrow “Live demo”; heading “See it work before you install it.” / “شاهدها وهي تعمل قبل التثبيت.” English support: “Every example runs the real package. Switch between Headless and UI to see what stays the same.” Arabic support: “كل مثال يشغّل الحزمة الحقيقية. بدّل بين Headless وUI لترى ما الذي لا يتغيّر.”

Row one is package tabs. Row two is the Headless/UI segmented control for Select. Single/Multiple is a small labeled control inside the Select preview. Keep genuine `@rivinia/*` integrations and behavior. Preview and code sit side by side at 1100px and wider. Below that, use a labeled Preview/Code toggle, never icon-only. Reserve stable preview space so package changes do not shift the surrounding layout. Give search inputs real labels and useful placeholders. Omit the “Interactive” label. Link to each verified docs route and to the package list.

## Decisions

Heading “Four decisions behind every package.” / “أربعة قرارات خلف كل حزمة.” Support “Each one is something you can verify in the code.” / “كل قرار منها تستطيع التحقق منه في الكود.” All four items stay visible; each has a title, one sentence, and one evidence link:

1. Simple APIs — “Predictable inputs, outputs, and defaults. The first example works in a few lines.” Link to quick start.
2. Flexible by design — “Use the headless layer with your own markup, or the UI package styled with CSS variables.” Link to headless demo.
3. Fast by default — Verify signal usage and OnPush-compatible APIs before using this claim; otherwise describe only what source confirms.
4. Accessible — Verify keyboard support and ARIA behavior in source/tests/docs; otherwise narrow or remove the claim.

Use a four-petal diagram with Rivinia at its center. Hover/focus on a decision highlights the matching petal. Mobile diagram follows the list and stays small. Do not add a fifth “Developer experience” label.

## Get started and footer

Heading “Start in three steps.” / “ابدأ في ثلاث خطوات.” Steps: Install, Import, Use. Snippets come from real Select demo source; each has a copy action and an `aria-live` “Copied” announcement. Primary CTA “Read the docs” / “اقرأ الوثائق”; secondary “Open the playground” / “افتح الـ Playground”.

Footer is inside this section, three columns and a bottom row: brand and one-line tagline; Product links Docs, Components, Playground; Resources links GitHub, npm only if verified, changelog only if present. Bottom row shows verified license/version plus existing language and theme controls. No unverifiable or social links.

Navigation has exactly Docs, Components, Playground. Merge Guides into Docs and preserve old routes through redirect/compatibility routing. Icon-only controls need visible labels or tooltips, accessible names, and 44px targets.

## Review matrix and evidence

Review at 1920×1080, 1440×900, 1366×768, and 390×844 in LTR/RTL and dark/light. Check hierarchy, typography, contrast, focus, keyboard flow, reduced motion, theme and language switching, no horizontal overflow, live component behavior, and stable layout while changing demo tabs. Save screenshots under `docs/screenshots/`. Use local Lighthouse if installed and report its accessibility score; do not install tooling to obtain it.

Before calling the work complete, answer the five-second test as three questions using only page copy. Report measured contrast pairs, browser evidence, and each unverified acceptance item explicitly. A successful build alone is not visual verification.

## Evidence and open questions

Verify facts from repository/package metadata before displaying them. As checked for this iteration, the installed Select README documents real headless and UI usage and the actual demo source is the source of code samples. Package registry metadata showed 1.0.3 and MIT for packages queried; recheck the current source before display. The root application package version is 0.0.0, so it is not a truthful library version badge. Do not display it as one. Record any missing evidence in `docs/home-open-questions.md`.

## Revision contract (R1–R9)

This revision supersedes conflicting earlier Home layout directions above. Preserve the Rivinia brand, CSR, lazy routes, localization, themes, and actual package behavior. Add no dependencies, edit no `@rivinia/*` packages or public APIs, and invent no claims, routes, APIs, or package state. Record each implementation step, verification result, commit, and one-line outcome in `docs/home-revision-log.md`. Localize every visible string in English and Arabic; keep technical terms Latin within Arabic. Use logical CSS properties and honor reduced motion.

### R1 — Document flow and scroll

Remove the section rail, observer/state/styles, and all mentions. Retain native proximity scroll snapping. Remove nested scrolling from Home and showcase styles after diagnosing each overflow. Keep only the Select listbox scrollable, capped at 16rem. Preserve clipping/ellipsis that do not create scroll containers. Add an architecture-check rule rejecting `overflow-y: auto|scroll` and `overflow: auto|scroll` in Home/showcase component CSS and Home/showcase rules in `src/styles.css`, except the explicitly allowlisted Select listbox selector.

### R2 — Shared code and copy components

Create shared `<app-copy-button>` with signal status, clipboard API and hidden-textarea/`execCommand` fallback, failure after 2500ms, success for 2s, timer cleanup, icon crossfade, success token, fixed minimum inline size, 44px target, stable accessible name “Copy code”, and `aria-live` status. It must not disable while copying. Localize announcements and add fake-timer specs.

Create shared `<app-code-block>` accepting `code`, `language` (`ts|html|css|bash`), optional `filename` and `caption`; provide a header and copy control, set code `dir="ltr"` and `translate="no"`, and render syntax tokens safely through Angular templates (never `innerHTML`). Use CSS variables for token colors and verify each syntax color against the code surface at 4.5:1 in both themes. Keep bash highlighting supported. Move the highlighter and spec with `git mv` to `src/app/shared/utils/code-highlight.ts` and its co-located spec. Update architecture/Home guidance: helpers belong in `shared/utils` when used by more than one feature.

Use the shared block for every Home code view: hero install snippet, showcase Code pane, and Get Started. Wrap code (`pre-wrap`, `overflow-wrap:anywhere`, tab size 2), use code at least 0.875rem, and keep snippets at most 14 lines; hero/Get Started lines should be at most 38 characters where practical. No code view may introduce nested scrolling.

### R3 — Showcase geometry and package data

Keep package tabs and Headless/UI as the only two showcase control rows. Single/Multiple belongs inside the Select preview. Reserve preview space based on the tallest real demo at each breakpoint; package switching must not shift tabs or pane headers. Vertically center the preview with 32px block padding and 27rem maximum width. Below 640px, wrap tabs, hide package IDs, and avoid horizontal scrolling. Keep at most six manifest showcase entries and test that bound. Derive visible packages from the manifest so registering a package needs no template edits.

### R4 — Real headless Select

Before implementation, inspect the actual demo and installed package typings. Build the headless example from real headless behavior: a combobox trigger with removable selected chips and a custom listbox with options/checks, including keyboard behavior. Show a live “State from headless layer” panel containing only real current state: `open`, active option, and selected IDs. Keep the UI Select package genuine. Use Angular enter/leave animation only when installed typings support it; otherwise use CSS `@starting-style`. If the UI package lacks a needed transition, report a library recommendation without changing it.

### R5 — Deferred Experience

Keep the hero eager. Defer Experience until viewport entry and prefetch on idle. Its placeholder has one root with the same measured minimum block size as the final section; use a static skeleton without shimmer under reduced motion. Apply 100ms minimum and 300ms maximum loading timing. Provide an error state and retry. Keep Decisions and Get Started eager. Reveal section content once over 240ms, but do not animate after the visitor has scrolled past it. Record initial and lazy bundle sizes before/after, distinguishing raw and transferred bytes.

### R6 — Four Pillars. One Core.

Replace “Four decisions” with the supplied “Four Pillars. One Core.” content and composition. Verify each sentence and chip against repository evidence; remove/reword unsupported claims and record them in `docs/home-open-questions.md`. Use only real routes/anchors. At 1100px+ use `1fr auto 1fr`, a 22rem core mark spanning two rows, and cards clockwise in specified areas. At 640–1099px center a 14rem mark over a 2×2 card layout. Below 640px use a 10rem mark followed by one card column. Cards use a raised surface, border, 16px radius, and 24px padding; chips are static.

Use existing brand SVG petal geometry and core diamond, approximately cropped to `viewBox="130 130 940 940"`, with explicit groups; do not rotate `<use>` because gradients use `userSpaceOnUse`. Add `data-petal` mapping and make the DX diamond dominant and labeled. Keep the diagram `aria-hidden`; cards carry accessible meaning. Hover/focus-within may highlight one petal with restrained gold glow; touch stays static and reduced motion disables animation.

### R7 — Get Started and Playground

Use three rows for Install, Import, Use, with accurate Select snippets from source. At 900px+ use two columns with a wider code column; below 900px stack them. Ensure no horizontal overflow at 390px. The Playground is currently a placeholder: show it as non-interactive “Playground — coming soon” in both languages and record the decision. Do not change the footer.

### R8 — Hero and short viewports

Diagnose visible hyphen spacing against font feature settings, Inter unicode coverage (including U+002D), and fallback selection. At 1366×768 fit H1, support copy, both CTAs, and first code card without scrolling; use a max-height 800px adjustment. Keep scroll cue visible. Use shared code block. At widths 1100px+, prevent bottom clipping at 1440×900.

### R9 — Manifest and metadata

Drive package/showcase content from the manifest and loader registry; adding one of the remaining packages must not require editing the template. Test unique manifest IDs and translation keys. Verify hero supporting copy, then use it for document description and matching Open Graph title/description in `index.html`. Add no Open Graph image without an existing asset.

### Required review evidence

Inspect and save screenshots under `docs/screenshots/revision/` at 1920×1080, 1440×900, 1366×768, and 390×844 in English/Arabic and dark/light. Check layout, contrast, focus, keyboard, reduced motion, RTL, no horizontal overflow, stable tabs, and component function. Report initial/lazy bundle sizes before/after. Run Lighthouse accessibility (target 95) only if locally available; do not install tooling. The final `docs/home-revision-report.md` must use exactly these headings: Done (commit hashes), Blocked (exact errors), Decisions, Claims removed or reworded, New Arabic strings for my review, Not verified, Recommendations for library (@rivinia/*), Next steps. End with a 10-line summary and stop.
