# Home revision report

## Done (commit hashes)

- `12d5ac9` — `feat(showcase): refine responsive demos and code navigation`.
- Datepicker now starts on the Cairo calendar date, its Now action updates to Cairo time, and the combined picker uses `Africa/Cairo`. Date, Time, and Date and time source tabs each offer HTML, TypeScript, and CSS examples.
- Preview/Code is icon-only with localized accessible names and tooltips. Mobile package tabs fit one row with responsive text; the view switch shares the workspace heading. Inner source-file tabs are compact, separated vertically, and code panes scroll within a responsive maximum height.
- Table width, its ID column and single-row pagination were improved. Toast actions are centered; preview notifications use the bottom-right placement. Modal content has more room on mobile and only scrolls when its content needs it.
- `a624088` — `feat(showcase): improve demos, source tabs, and table actions`.
- Shared code blocks now render source LTR; copy controls are flush with the block edge and use a lighter border. Showcase source view now switches accessibly between HTML, TypeScript, and CSS.
- Datepicker preview includes date, time-row, and date-time examples with localized selections. Table pagination uses the real `rv-select`, Lucide action icons, and working view/edit/delete demo actions.
- Modal now demonstrates details → workflow → delete confirmation, plus edit/save and an unsaved-change guard. Toast preview notifications stay within the demo area. Footer package links derive from the manifest and include all 11 packages.

## Blocked (exact errors)

- No implementation or verification failures remain. One initial `npm run verify` stopped with `Showcase source is stale: .../src/generated/modal-example.source.generated.ts`; `npm run build` refreshed it via `prebuild`, and the final verify passed.
- No blocker remains. An earlier stale generated source was refreshed by the existing `prebuild` hook; the final verification passes.

## Decisions

- The supplied choice was applied: direct Lucide icons in the table demo; the existing icon registry remains for the rest of the interface.
- The modal library hides both dialogs when a parent and its child both set `coversOthers`, because each considers the other a cover. To keep one visible modal at a time, each next dialog closes the current one before opening. The confirmation dialog remains a separate step.
- Date/time examples use the installed `@rivinia/datepicker` API: the time row edits a time value; `rv-datetimepicker` owns date/time selection and timezone handling.
- The datepicker source pane groups focused usage examples by control and shows a separate HTML, TypeScript, and CSS file for each group. Its only nested source scroll area is capped responsively and keyboard-focusable.

## Claims removed or reworded

- Replaced the previous generic workspace confirmation modal with package details, review workflow, delete confirmation, and edit/save examples.
- Reworded the workflow copy to say the next dialog opens in place of the previous one; it no longer claims the prior dialog remains covered.
- Footer package names come from the existing manifest; no package status or route claims were added.

## New Arabic strings for my review

- Date/time: «التاريخ»، «الوقت»، «التاريخ والوقت»، «الوقت المحدد»، «التاريخ والوقت المحددان»، «أمثلة اختيار التاريخ والوقت».
- Table: «الإجراءات»، «عرض {name}»، «تعديل {name}»، «حذف {name}»، «تمت إزالة {name} من هذا المثال.».
- Modal: «راجع سير عمل الحزمة»، «تظهر هذه الخطوة بدلًا من النافذة السابقة.»، «تأكيد الحذف»، «احفظ التغييرات قبل إغلاق هذه النافذة.»، «تم حفظ {name}.».
- Source tabs and toast: «ملفات المثال»، «نجاح»، «معلومة»، «تنبيه»، «إشعارات المعاينة».
- Added package labels: `Menu` and `Popup` retain their product names in English.
- Datepicker source groups: «التاريخ»، «الوقت»، «التاريخ والوقت»; the Cairo Now note is localized in both dictionaries.

## Not verified

- The 16 showcase screenshots across the required four viewports, both languages, and both themes are saved under `docs/screenshots/revision/showcase-comments/`. The document width was checked in the browser matrix; no horizontal overflow appeared.
- `npm run verify` passed the automated contrast check for 30 theme pairs. No Axe or Lighthouse audit, full reduced-motion review, or complete site-wide keyboard traversal was run. Keyboard navigation and scrolling in the source tabs were checked directly.

## Recommendations for library (@rivinia/*)

- In `@rivinia/modal`, make `coversOthers` directional by opening order: only a newer covering modal should hide older dialogs. Currently two covering instances can each mark the other covered, leaving no dialog visible. This docs demo uses sequential replacement as a workaround; library code and public APIs were not changed.
- Keep the Datepicker README explicit that `rv-time-row` edits a time value and `rv-datetimepicker` is the date/time picker with timezone behavior.

## Next steps

- Review the listed Arabic strings.
- Run an Axe/Lighthouse audit and full reduced-motion review when those checks are available.
- Consider a modal-library fix separately from this docs-only change.

1. Code and showcase feedback implemented.
2. Datepicker examples use installed exports.
3. Source tabs show one file at a time.
4. Table uses Rivinia Select for page size.
5. Table action icons are keyboard-labeled.
6. Modal replacement flows were browser-checked.
7. Unsaved changes block dismissal and notify.
8. Toast preview stays inside its area.
9. Footer now lists 11 manifest packages.
10. `npm run verify` passed; screenshot matrix remains open.
