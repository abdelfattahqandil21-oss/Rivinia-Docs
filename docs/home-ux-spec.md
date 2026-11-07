# Rivinia Docs home UX specification

## Purpose and design direction

Direction: **The quiet instrument**. Rivinia is a focused set of Angular packages for developers who want to choose between headless behavior and a ready-made UI. The page should make that choice clear and let visitors try the real packages.

The five-second test: visitors can identify what Rivinia is, who it serves, and where to start from the hero copy alone. Use calm hierarchy, generous but purposeful spacing, neutral surfaces, restrained gold, and subtle purple only for meaning. Do not imitate another documentation site's visual identity.

Required composition: use a two-column desktop hero, a real Select preview, four evidence-backed decisions, and a three-step start/footer composition. Do not use image-led editorial layouts, empty product mockups, or motion that competes with the content.

## Page structure and global layout

Four sections in order: Hero, Experience, Decisions, Get started. The footer belongs inside Get started. Each section has one eyebrow, one heading, one supporting sentence, and its content. A desktop section rail appears only at widths of at least 1100px; each dot is a labeled link, with the active section observed through one IntersectionObserver. Hide the rail on smaller viewports.

Use a 72rem content maximum, inline padding `clamp(1rem, 4vw, 2rem)`, reading text no wider than 60ch, and a demo area no wider than 80rem. Sections use `min-height: calc(100svh - var(--navbar-height))`, centered grid alignment, block padding `clamp(4rem, 8vw, 7rem)`, and start scroll alignment. Taller sections grow and never clip. Use proximity scroll snapping, disabled below 640px, below 600px viewport height, and under reduced motion. Set scroll padding to the navbar height.

Spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Radius tokens: 8, 12, 16px. Keep existing semantic tokens where they work; only add the minimum neutral surface steps needed for base, raised, and overlay surfaces.

## Typography and accessibility

Self-host WOFF2 with `font-display: swap`: Inter variable for Latin UI/display, IBM Plex Sans Arabic at 400/500/700 for Arabic, and JetBrains Mono at 400/500 for code. Use unicode subsets and preload only the most-used Latin and Arabic files. Inter uses `cv11` and `ss01`; numeric UI uses tabular figures. Code stays `dir="ltr"` even in Arabic pages. Stacks: `'Inter', system-ui, sans-serif` and `'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif`.

Type scale: H1 `clamp(2.5rem, 1.5rem + 4vw, 4.5rem)`, 1.05 line height, 700 weight, -0.02em tracking, max 18ch. H2 `clamp(1.75rem, 1.2rem + 2vw, 2.75rem)`, 1.15 line height, 600 weight. Eyebrow 0.875rem/500, uppercase and 0.08em tracking in English only. Body 1.125rem/1.6; small text at least 0.875rem; code 0.9rem/1.6. Arabic uses 1.8 line height, no tracking, italics, or uppercase.

Meet WCAG 2.2 AA: normal text contrast at least 4.5:1 and large text 3:1, visible keyboard focus, full keyboard access, logical properties for RTL, and reduced-motion support. Interactive targets are at least 44px. Focus ring is 2px gold with 2px offset. Supporting copy is muted but remains readable. Keep the main message visible without interaction.

Use at most two visible control rows. Progressive disclosure is for implementation detail only. Every promise links to a live demo, docs, or repository evidence. Do not claim unverified performance, accessibility coverage, publication state, version, license, or compatibility.

## Visual language and motion

Reuse semantic colors. Gold is reserved for the primary CTA, focus, and one emphasis per section; CTA text is dark. Use faint low-alpha hairline borders, without heavy shadows. A radial mask may fade a faint dot/grid pattern; one soft gold radial glow may sit behind the hero code sample. Nothing else glows. Code panels have restrained window dots, filename, and language labels.

Sections may fade in and translate 8px over 240ms ease-out once when observed. Use one IntersectionObserver where practical. No parallax or looping animation. Disable motion for `prefers-reduced-motion`.

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
