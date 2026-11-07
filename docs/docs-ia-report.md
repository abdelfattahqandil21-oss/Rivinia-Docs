# Docs IA implementation report

## Done

- `a295b64` — specified Docs IA, project rules, and Docs skill.
- `1dd0274` — unified semantic colors and added color/contrast gates.
- `9672195`, `0d68283`, `c2f9d6b`, `731ac3d`, `c1095d1` — corrected Guides visibility, translation coverage, main landmark ownership, active navigation, and heading scale.
- `7d828f0`, `936b3f0`, `b312497`, `18db1e2`, `c456d4e` — generated package metadata, Docs routes/shell, package navigation/page rail, navbar drawer, and Docs prose/heading anchors.
- `50dc1af`, `2b626c3`, `3d3fe93` — package hub, localized Getting Started sequence, and package overview pages.
- `62f88da` — corrected the skip link so it stays on the active route and explicitly focuses the main landmark.
- `b4a9a84` — labeled declared dependency ranges separately from the published versions on package overview pages.
- Captured 20 Docs hub screenshots at the five required viewport sizes × LTR/RTL × dark/light, plus four Home comparison screenshots, in `docs/screenshots/docs-ia/`.
- Browser-checked Docs package routes at 390px: one H1/main landmark, package-specific title, and no horizontal overflow.
- Verified the five-second discovery path at 390px: open Docs, filter for Select, open its page, and find the live-example action in 2.7 seconds; one H1/main and no horizontal overflow.
- Keyboard-checked drawer focus containment, Escape close/focus return, heading focus after route navigation, and skip-link route preservation plus main focus.

## Blocked

- None.

## Decisions

- Latest pages have no version prefix. Package metadata is generated from installed manifests; npm install commands are shown only when the installed version matches the independently verified published version.
- `^1.0.0` remains the declared `@rivinia/popup` dependency range for Select. Docs now labels that separately from the installed/published version `1.0.3`; the range is not the resolved version.
- Quick starts and live links are limited to packages with genuine registered demos. Headless/UI details appear only when the package has a distinct `./ui` export.
- `@rivinia/menu` is included in Components due to its public UI export; `@rivinia/popup` is excluded because it has no UI export and is a shared primitive.

## Color audit summary

- Global semantic tokens were aligned to the established Home palette, with no new hues. Docs uses token references; the selection and dialog backdrop roles derive from existing tokens with `color-mix()`.
- Color gate passed with seven pre-existing literals in four non-token files outside the Docs scope.
- Contrast gate passed 30 theme pairs. Existing meaningful-border contrast remains below 3:1 for light and dark page backgrounds (1.25:1 and 1.57:1); recorded as pre-existing in `docs/color-audit.md`.

## Coverage gaps

See `docs/docs-coverage.md` for all 11 packages and seven overview blocks. Quick start/live demos exist for Select, Datepicker, Table, Modal, and Toast. UI entry points are available for i18n, Select, Datepicker, Table, Modal, Toast, and Menu. Dependency metadata exists for i18n, Select, and Menu. Other blocks are omitted when package metadata or a real demo does not provide them.

## New Arabic strings for review

- Changed `page.components.lead` to: `{count, plural, =0 {لا توجد حزم.} one {حزمة واحدة، ولكل منها عقد واضح.} two {حزمتان، ولكل واحدة عقد واضح.} few {# حزم، ولكل واحدة عقد واضح.} many {# حزمة، ولكل واحدة عقد واضح.} other {# حزمة، ولكل واحدة عقد واضح.}}`.
- Added: `docs.groups.foundations` الأساسيات; `docs.groups.components` المكونات; `docs.groups.primitives` اللبنات الأساسية.
- Added: `docs.filter.label` تصفية الحزم; `docs.filter.placeholder` ابحث عن حزمة; `docs.filter.count` ICU result count; `docs.filter.empty` لا توجد حزم تطابق البحث.
- Added: `docs.menu` قائمة التوثيق; `docs.menu.short` التوثيق; `docs.closeMenu` إغلاق قائمة التوثيق.
- Added: `docs.copyHeadingLink` نسخ رابط العنوان; `docs.headingLinkCopied` تم نسخ رابط العنوان.; `docs.headingLinkFailed` تعذر نسخ رابط العنوان.
- Added: `docs.hub.lead` تعرض صفحات الحزم نقاط التصدير والإصدارات والأمثلة المتاحة عند وجودها.; `docs.gettingStarted` البدء; `docs.previous` السابق; `docs.next` التالي; `docs.uiEntry` UI; `docs.preOne` ما قبل 1.0.
- Added: `docs.entryPoints` نقاط الدخول; `docs.importPaths` مسارات الاستيراد; `docs.quickStart` بداية سريعة; `docs.dependencies` الاعتماديات; `docs.peerDependencies` اعتماديات الأقران.
- Added: `docs.packageUi` مدخل واجهة المستخدم; `docs.packageUiDescription` تصدّر هذه الحزمة مدخلًا منفصلًا لواجهة المستخدم. يظهر مساره ضمن القائمة أدناه.; `docs.liveExample` مثال مباشر; `docs.seeLive` شاهد المثال.
- Added: `docs.library` نظرة عامة على المكتبة; `docs.notFound.title` الصفحة غير موجودة; `docs.notFound.body` صفحة التوثيق هذه غير موجودة.; `docs.notFound.back` العودة إلى التوثيق.
- Added for version clarity: `docs.range` النطاق المطلوب; `docs.installedVersion` الإصدار المنشور.

## Not verified

- Lighthouse accessibility was not run; the Lighthouse CLI is not installed.
- Axe was not run; no Axe package is installed.
- Screenshot files cover the Docs hub matrix and Home comparisons, not every package route at every viewport. Individual package routes were checked at 390px.
- Cross-browser verification beyond system Chrome was not run.
- Production build reports existing CSS budget warnings for `interactive-showcase.component.css` (7.33 kB vs 4 kB) and `select-example.component.css` (4.38 kB vs 4 kB).

## Prompt 2 inputs

- Public typings and export metadata: installed package manifests/exports under `node_modules/@rivinia/*`, summarized by generated metadata in `src/generated/package-meta.generated.ts`.
- Genuine demo sources: `src/app/features/showcase/demos/{select,datepicker,table,modal,toast}/` and registered source normalization in `src/app/features/showcase/showcase-example.loaders.ts`.
- The overview pages reuse those generated demo sources; no fabricated API examples were added.

## Next steps

- Review the Arabic strings above.
- Decide whether to adjust pre-existing low-contrast meaningful borders in a separately scoped token change.
- Add API reference pages only after reviewing the public typings and deciding the desired content depth.

## Ten-line summary

Docs hub and responsive shell are implemented.
All eleven package overviews are data-backed.
Getting Started is split into three localized pages.
Package metadata is generated from installed manifests.
Install commands reflect independently verified npm versions.
Dependency ranges are labeled separately from published versions.
Navigation, focus, drawer, and skip-link keyboard flows were checked.
Twenty Docs screenshots and four Home comparisons were captured.
Verify passed; Lighthouse and Axe remain unverified.
No package publishing or push was performed.
