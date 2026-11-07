# Docs IA implementation report

## Done

- `a295b64` — specified Docs IA, project rules, and Docs skill.
- `1dd0274` — unified semantic colors and added color/contrast gates.
- `9672195`, `0d68283`, `c2f9d6b`, `731ac3d`, `c1095d1` — corrected Guides visibility, translation coverage, main landmark ownership, active navigation, and heading scale.
- `7d828f0`, `936b3f0`, `b312497`, `18db1e2`, `c456d4e` — generated package metadata, Docs routes/shell, package navigation/page rail, navbar drawer, and Docs prose/heading anchors.
- `50dc1af`, `2b626c3`, `3d3fe93` — package hub, localized Getting Started sequence, and package overview pages.
- `62f88da` — corrected the skip link so it stays on the active route and explicitly focuses the main landmark.
- `b4a9a84` — labeled declared dependency ranges separately from the published versions on package overview pages.
- Added localized usage guides for all eleven packages, based on installed package READMEs and public declarations, with links to their maintained detailed docs. Existing showcase sources remain the Quick start for Select, Datepicker, Table, Modal, and Toast.
- Checked all eleven guide routes in Chrome at 390px: each has one H1/main, three concepts, three public API highlights, three detailed reference links, no browser errors, and no horizontal overflow. Checked the five demo-library routes at 360px, 768px, 1280px, and 1440px; compacted the Docs menu control below 400px to remove a 14px navbar overflow. Switched Select to Arabic/RTL and confirmed no overflow.
- Captured 20 Docs hub screenshots at the five required viewport sizes × LTR/RTL × dark/light, plus four Home comparison screenshots, in `docs/screenshots/docs-ia/`.
- Browser-checked Docs package routes at 390px: one H1/main landmark, package-specific title, and no horizontal overflow.
- Verified the five-second discovery path at 390px: open Docs, filter for Select, open its page, and find the live-example action in 2.7 seconds; one H1/main and no horizontal overflow.
- Keyboard-checked drawer focus containment, Escape close/focus return, heading focus after route navigation, and skip-link route preservation plus main focus.

## Blocked

- None.

## Decisions

- Latest pages have no version prefix. Package metadata is generated from installed manifests; npm install commands are shown only when the installed version matches the independently verified published version.
- `^1.0.4` is the declared `@rivinia/popup` dependency range for Select. Docs labels that separately from the installed/published version `1.0.4`; the range is not the resolved version.
- Quick starts and live links are limited to packages with genuine registered demos. Headless/UI details appear only when the package has a distinct `./ui` export.
- `@rivinia/menu` is included in Components due to its public UI export; `@rivinia/popup` is excluded because it has no UI export and is a shared primitive.

## Color audit summary

- Global semantic tokens were aligned to the established Home palette, with no new hues. Docs uses token references; the selection and dialog backdrop roles derive from existing tokens with `color-mix()`.
- Color gate passed with seven pre-existing literals in four non-token files outside the Docs scope.
- Contrast gate passed 30 theme pairs. Existing meaningful-border contrast remains below 3:1 for light and dark page backgrounds (1.25:1 and 1.57:1); recorded as pre-existing in `docs/color-audit.md`.

## Coverage gaps

See `docs/docs-coverage.md` for all 11 packages and seven overview blocks. Every package now has localized concept/API guidance and links to maintained detailed docs. Quick start/live demos exist for Select, Datepicker, Table, Modal, and Toast. UI entry points are available for i18n, Select, Datepicker, Table, Modal, Toast, and Menu. Dependency metadata exists for i18n, Select, and Menu. Other blocks are omitted when package metadata or a real demo does not provide them.

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

## Package-guide Arabic strings added in R11

- `docs.packageGuide`: استخدام الحزمة; `docs.packageConcepts`: مفاهيم أساسية; `docs.packageApiHighlights`: أبرز عناصر الواجهة العامة; `docs.packageFurtherReading`: توثيق تفصيلي.
- `docs.guide.env.summary`: استخدم عقدًا مكتوب الأنواع لملفات البيئة التي ينشئها schematic الخاص بـ Angular CLI وتُختار وقت البناء.
- `docs.guide.env.contract`: يتطلب BaseEnvironment الحقلين readonly production وversion؛ أضف حقول تطبيقك في واجهة خاصة بك.
- `docs.guide.env.buildTime`: يستبدل Angular ملف البيئة المختار أثناء البناء. القيم المضمنة في حزمة المتصفح ظاهرة للمستخدمين، فلا تضع فيها أسرارًا.
- `docs.guide.env.schematic`: شغّل ng add @rivinia/env داخل مساحة Angular CLI لإنشاء ملفات البيئة واستبدالات إعدادات البناء.
- `docs.guide.env.api.baseEnvironment`: عقد الأنواع للحقلين المطلوبين production وversion.
- `docs.guide.env.api.schematic`: أداة Angular CLI لإنشاء ملفات البيئة واستبدالات إعدادات البناء.
- `docs.guide.env.reference.scaffolding`: إنشاء ملفات البيئة
- `docs.guide.http.summary`: استخدم عميلًا واحدًا مكتوب الأنواع لطلبات Observable وموارد Angular التفاعلية المدعومة بالإشارات.
- `docs.guide.http.client`: يعتمد RiviniaHttp على HttpClient من Angular، لذلك تظل interceptors وHttpContext الخاصة بالتطبيق متاحة.
- `docs.guide.http.resource`: استخدم getResource لطلبات GET التفاعلية؛ يمكن لإشارة أو endpoint تفاعلي إعادة الطلب، وتعطّله القيمة undefined.
- `docs.guide.http.envelopes`: يمر جسم الاستجابة كما هو افتراضيًا. فك أغلفة الاستجابة والتحقق من الإخفاقات سياسات اختيارية على مستوى الطلب أو المزوّد.
- `docs.guide.http.api.inject`: يحقن عميل RiviniaHttp المُعدّ في خدمة Angular.
- `docs.guide.http.api.joinUrl`: يجمع عنوان الأساس مع endpoint دون شرطات مائلة مكررة، ويمرر عناوين HTTP المطلقة كما هي.
- `docs.guide.http.api.resource`: ينشئ مورد GET تفاعليًا باستخدام حالة httpResource من Angular.
- `docs.guide.http.reference.urls`: العناوين والخدمات
- `docs.guide.http.reference.resources`: الموارد التفاعلية
- `docs.guide.http.reference.envelopes`: أغلفة الاستجابة والأخطاء
- `docs.guide.i18n.summary`: زامن القواميس وحالة اللغة واتجاه النص وتنسيق locale من خدمة Angular واحدة.
- `docs.guide.i18n.languageState`: عرّف كل لغة بالمعرّف والاسم المحلي والاتجاه وlocale؛ وتعرض الخدمة اللغة والاتجاه الحاليين كإشارات.
- `docs.guide.i18n.translations`: استخدم rvTranslate في القوالب، وt() للنصوص المعتمدة على الإشارات في المكوّن، أو translate() في TypeScript العادي.
- `docs.guide.i18n.icu`: تدعم رسائل ICU صيغ plural وselect وselectordinal والإزاحات وتنسيق الأرقام والتواريخ، بما فيها فئات الجمع العربية.
- `docs.guide.i18n.api.manager`: حالة اللغة والبحث عن الترجمات والتبديل ومعلومات locale.
- `docs.guide.i18n.api.pipe`: pipe للقوالب يحدّث النص المترجم عند تغيير اللغة الحالية.
- `docs.guide.i18n.api.define`: يعرّف إعداد اللغات المكتوب الأنواع والمساعدات اللازمة لبدء التطبيق.
- `docs.guide.i18n.reference.translations`: ترجمة النصوص
- `docs.guide.i18n.reference.switching`: تبديل اللغة
- `docs.guide.i18n.reference.icu`: رسائل ICU
- `docs.guide.i18n.reference.api`: مرجع الواجهة البرمجية
- `docs.guide.theme.summary`: اضبط خصائص CSS الدلالية مرة واحدة لتستخدم مكوّنات Rivinia لوحة ألوان ونظام سمة موحدين.
- `docs.guide.theme.tokens`: اربط رموزًا مثل --rv-bg و--rv-fg و--rv-accent في ملف الأنماط العام للتطبيق.
- `docs.guide.theme.schemes`: تتضمن الأنماط قيمًا فاتحة وداكنة؛ وتحدد data-rv-theme على عنصر المستند السمة المستخدمة.
- `docs.guide.theme.adapters`: اختر ملف الأنماط الأساسي أو محولًا واحدًا لمنصة التنسيق. المحول يضمّن السمة الأساسية، لذا استيرادهما معًا يكرر CSS.
- `docs.guide.theme.api.base`: ملف الأنماط الأساسي الذي يوفر الرموز الدلالية الافتراضية لمكوّنات Rivinia.
- `docs.guide.theme.api.css`: مسار صريح لملف الأنماط عند استخدام bundler يحتاج إلى مسار ملف.
- `docs.guide.theme.api.adapters`: مسارات محولات Tailwind وBootstrap وSass لمنصات التنسيق الموجودة.
- `docs.guide.theme.reference.tokens`: رموز السمة
- `docs.guide.theme.reference.stacks`: محولات منصات التنسيق
- `docs.guide.theme.reference.components`: تخصيص سمات المكوّنات
- `docs.guide.menu.summary`: أنشئ قوائم إجراءات ميسّرة بواجهة جاهزة أو بمتحكم القوائم headless.
- `docs.guide.menu.actions`: استخدم نمط menu-button للإجراءات. فهو ليس قائمة تنقل menubar ولا listbox عامة.
- `docs.guide.menu.keyboard`: تدعم الواجهة التنقل بالأسهم والبحث بالكتابة وEscape للإغلاق وإعادة التركيز للزر، وTab لمغادرة القائمة دون حبس التركيز.
- `docs.guide.menu.layers`: يوفر مدخل UI العرض وسلوك لوحة المفاتيح والتركيز. أما المدخل headless فيدير الحالة والعناصر، ويترك markup والدلالات لتطبيقك.
- `docs.guide.menu.api.controller`: متحكم headless لحالة الفتح وتسجيل العناصر والعنصر النشط والتنقل بلوحة المفاتيح.
- `docs.guide.menu.api.component`: مكوّن قائمة جاهز يدعم العناصر المعلنة أو صفوف القائمة المسقطة.
- `docs.guide.menu.api.trigger`: يحدد عنصر التشغيل ويصدر معرّف العنصر المختار بعد إغلاق القائمة.
- `docs.guide.menu.reference.readyMade`: واجهة القائمة الجاهزة
- `docs.guide.menu.reference.headless`: متحكم القائمة headless
- `docs.guide.menu.reference.interaction`: التفاعل بلوحة المفاتيح والمؤشر
- `docs.guide.popup.summary`: استخدم مساعدات headless المشتركة لتحديد موضع لوحات popup وربط مستمعات الإغلاق.
- `docs.guide.popup.position`: احسب إحداثيات ضمن نافذة العرض من هندسة زر التشغيل واللوحة والموضع واتجاه النص؛ وتوضح النتيجة ما إذا انعكس الموضع عموديًا.
- `docs.guide.popup.dismissal`: اربط إغلاق popup عند النقر الخارجي أو التمرير أو تغيير الحجم. ينظف Angular DestroyRef المستمعات، والقيم الفارغة لكائنات المتصفح آمنة.
- `docs.guide.popup.boundary`: لا توفر هذه الحزمة markup أو أنماطًا أو حالة فتح أو سياسة تركيز أو لوحة مفاتيح أو دلالات للعناصر؛ يتولى المكوّن المضيف هذه القرارات.
- `docs.guide.popup.api.position`: يحسب إحداثيات popup مضبوطة ضمن حدود الشاشة وفق الهندسة والموضع المحددين.
- `docs.guide.popup.api.dismissal`: يسجل مستمعات الإغلاق وينظفها مع دورة حياة المكوّن المضيف.
- `docs.guide.popup.api.constants`: الفاصل الافتراضي عن زر التشغيل والهامش عن حافة نافذة العرض لمساعد تحديد الموضع.
- `docs.guide.popup.reference.core`: مواصفات نواة popup

## Package-guide Arabic strings added in R12

- `docs.guide.select.summary`: اختر بين متحكم الاختيار headless وحقل الاختيار الجاهز؛ فكلاهما يستخدم نموذج القيم المفردة أو المتعددة نفسه.
- `docs.guide.select.modes`: يختار النمط المفرد قيمة واحدة ويغلق القائمة. أما النمط المتعدد فيبدّل القيم ويبقي القائمة مفتوحة لمواصلة الاختيار.
- `docs.guide.select.filtering`: البحث غير حساس لحالة الأحرف واللكنات، ويطبّع التشكيل والتطويل وأشكال الألف العربية.
- `docs.guide.select.forms`: يطبق المكوّن الجاهز FormValueControl من Angular، ويعمل مع Signal Forms وReactive Forms وngModel.
- `docs.guide.select.api.controller`: متحكم headless لسجل الخيارات والتصفية والقيمة المحددة.
- `docs.guide.select.api.component`: حقل جاهز يعرض popup والخيارات وسلوك لوحة المفاتيح والتركيز.
- `docs.guide.select.api.change`: نوع القيمة التي تصدرها الواجهة؛ ويعتمد شكلها على النمط المفرد أو المتعدد.
- `docs.guide.select.reference.headless`: إنشاء حقل اختيار مخصص
- `docs.guide.select.reference.forms`: النماذج وربط القيمة
- `docs.guide.select.reference.accessibility`: لوحة المفاتيح وإمكانية الوصول
- `docs.guide.datepicker.summary`: اختر تواريخ أو أوقاتًا مدنية بالتقويم الغريغوري مع واجهة اختيار اختيارية وتنسيق محلي ولوحة مفاتيح ومعالجة صريحة للمناطق الزمنية.
- `docs.guide.datepicker.civilValues`: تمثل RiviniaDate وRiviniaDateTime قيم التقويم؛ وتحويل المنطقة الزمنية عملية صريحة لا تحويل ضمني إلى Date.
- `docs.guide.datepicker.timeZones`: استخدم أدوات المنطقة الزمنية لحل وقت الجدار وغموض التوقيت الصيفي في منطقة مسماة.
- `docs.guide.datepicker.locale`: يتحكم locale في تنسيق التاريخ والوقت ودورة الساعة والتسميات والاتجاه؛ وتدعم الواجهة RTL ونماذج Angular.
- `docs.guide.datepicker.api.values`: أنواع قيم التاريخ والتاريخ والوقت المدنية التي يقبلها المتحكم والواجهة.
- `docs.guide.datepicker.api.controller`: متحكم headless لحالة التقويم والتنقل فيه.
- `docs.guide.datepicker.api.components`: حقلا إدخال جاهزان للتاريخ فقط وللتاريخ والوقت من مدخل UI.
- `docs.guide.datepicker.reference.overview`: نظرة عامة على منتقي التاريخ
- `docs.guide.datepicker.reference.timeZones`: المناطق الزمنية والتوقيت الصيفي
- `docs.guide.datepicker.reference.keyboard`: التنقل بلوحة المفاتيح وRTL
- `docs.guide.table.summary`: نمذج الصفوف والأعمدة المكتوبة الأنواع عبر pipeline إشارات headless، ثم اعرضها بواجهة الجدول الاختيارية أو markup مخصص.
- `docs.guide.table.typedColumns`: عرّف الأعمدة وفق نوع الصف حتى تظل accessors وقيم الخلايا وحالة الجدول مرتبطة بنموذج بياناتك.
- `docs.guide.table.pipeline`: تتضمن النواة البحث والتصفية والترتيب وتقسيم الصفحات وتحديد الصفوف وحساب امتداد الصفوف والأعمدة.
- `docs.guide.table.customization`: استخدم شبكة الجدول الجاهزة لعرض النموذج، أو احتفظ بالمتحكم واعرض markup جدول مخصصًا.
- `docs.guide.table.api.create`: ينشئ نموذج جدول تفاعليًا من خيارات الأعمدة والبيانات المدعومة بالإشارات.
- `docs.guide.table.api.column`: يبني تعريف عمود مكتوب الأنواع وaccessor له.
- `docs.guide.table.api.paginate`: يعيد الصفحة المطلوبة وبيانات تقسيم الصفوف إلى صفحات.
- `docs.guide.table.reference.columns`: الأعمدة وaccessors المكتوبة الأنواع
- `docs.guide.table.reference.paging`: تقسيم الصفحات وحالة الجدول
- `docs.guide.table.reference.selection`: تحديد الصفوف
- `docs.guide.modal.summary`: افتح محتوى نافذة مكتوب الأنواع واستقبل نتائج مكتوبة الأنواع، مع ضبط سياسات الإضافة والإغلاق ودورة الحياة.
- `docs.guide.modal.typedResults`: مرر نوع البيانات عند فتح النافذة، واستقبل نتيجة تميّز التأكيد والإغلاق وأحوال الإنهاء الأخرى.
- `docs.guide.modal.guards`: يمكن للحراس غير المتزامنين منع الإغلاق لمعالجة التغييرات غير المحفوظة أو التحقق قبل إغلاق النافذة.
- `docs.guide.modal.admission`: اختر عرض النوافذ المتراكمة أو وضعها في طابور؛ ويتولى مضيف UI الاختياري العرض وتحديد الموضع.
- `docs.guide.modal.api.provider`: يسجل مدير النوافذ وإعدادات دورة حياتها.
- `docs.guide.modal.api.open`: يفتح محتوى مكتوب الأنواع مع البيانات والمعرّف الثابت والبيانات الوصفية وخيارات الإغلاق.
- `docs.guide.modal.api.result`: مقبض لانتظار نتيجة إكمال النافذة المكتوبة الأنواع.
- `docs.guide.modal.reference.typed`: بيانات ونتائج النوافذ المكتوبة الأنواع
- `docs.guide.modal.reference.guards`: حراس دورة الحياة والإغلاق
- `docs.guide.modal.reference.stacking`: أحجام النوافذ وتراصها
- `docs.guide.toast.summary`: ضع إشعارات مؤقتة في طابور عبر خدمة قائمة على الإشارات، واعرضها بمكوّن قائمة الإشعارات الاختياري.
- `docs.guide.toast.queue`: تدير الخدمة حالة الإشعارات والمؤقتات ومنع التكرار وتجاوز السعة باستقلال عن طريقة العرض.
- `docs.guide.toast.actions`: يمكن أن يحتوي الإشعار على إجراء؛ اختر النوع والمدة بما يناسب الرسالة ويمنح المستخدم وقتًا كافيًا للاستجابة.
- `docs.guide.toast.layers`: استخدم الخدمة دون واجهة عند الحاجة، أو اعرض القائمة المدارة من مدخل UI المنفصل.
- `docs.guide.toast.api.inject`: يحقن خدمة الإشعارات داخل مكوّن أو خدمة Angular.
- `docs.guide.toast.api.show`: يضيف إشعارًا مُعدًا إلى الطابور المُدار.
- `docs.guide.toast.api.list`: يعرض الإشعارات الظاهرة ويديرها من مدخل UI.
- `docs.guide.toast.reference.readyMade`: قائمة الإشعارات الجاهزة
- `docs.guide.toast.reference.headless`: استخدام الخدمة دون الواجهة
- `docs.guide.toast.reference.managedList`: الطبقة العليا والقائمة المدارة

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
