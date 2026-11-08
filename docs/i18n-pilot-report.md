# i18n documentation implementation

The installed package is `@rivinia/i18n` 1.0.4. Sources reviewed: the installed README, manifest and public declarations; library source under `projects/i18n`; and `docs/i18n/{translating,switching,dictionaries,icu,resilience,cli,toggle,select,api}.md` in the Rivinia checkout.

## Pages

`/docs/i18n` has Overview, Quick start, a standalone Guides index, seven topic guides (translating, configuration, switching, ICU, resilience, controls, CLI), API and Changelog. A generic reference-page renderer handles data sections, code, tables and previous/next links. Route/sidebar metadata stays separate from lazy-loaded prose and examples. English and Arabic keys cover all new copy.

## Replaced content

Removed the old i18n summary, three concept paragraphs, three API name bullets and four outbound GitHub reference links from the generic package-guide model, along with their locale keys. Their responsibilities are covered by the local pages. The current-release changelog contains 1.0.4 only. No per-library content component was added.

## Evidence

- Chrome opened all 12 routes, including all seven topic guides, without a page error or not-found view.
- Clicking API headings retained `/docs/i18n/api#…`.
- At 390px the mobile Docs dialog exposed the topic routes and current API entry. Arabic Quick start rendered its translated H1 with `dir="rtl"`.
- `npm run verify`: final formatting, architecture, colors, contrast, i18n, generated sources, build and all 77 tests in 17 files passed.
- Lighthouse, AXE and a full RTL/theme matrix have not been run. Browser evidence does not establish those checks.
