---
title: "@rivinia/theme"
summary: "The shared Rivinia design-token layer: one import, one place to set the whole component ecosystem's colours, shapes and type."
order: 0
sources:
  - node_modules/@rivinia/theme/package.json
  - node_modules/@rivinia/theme/README.md
  - node_modules/@rivinia/theme/styles/theme.css
  - node_modules/@rivinia/theme/fesm2022/rivinia-theme.mjs
  - node_modules/@rivinia/theme/types/rivinia-theme.d.ts
  - src/content/_library-source/theme/1.0.4/docs/README.md
  - node_modules/@rivinia/select/fesm2022/rivinia-select-ui.mjs
  - node_modules/@rivinia/datepicker/fesm2022/rivinia-datepicker-ui.mjs
  - node_modules/@rivinia/table/fesm2022/rivinia-table-ui.mjs
  - node_modules/@rivinia/modal/fesm2022/rivinia-modal-ui.mjs
  - node_modules/@rivinia/toast/fesm2022/rivinia-toast-ui.mjs
  - node_modules/@rivinia/menu/fesm2022/rivinia-menu-ui.mjs
  - node_modules/@rivinia/i18n/fesm2022/rivinia-i18n-ui.mjs
---

## One import for the shared palette

A dashboard can use Select for filters, Table for results, and Toast for feedback. Importing the theme once gives these ready-made interfaces a shared vocabulary for backgrounds, text, accent, borders, radius, font and shadow.

```css
/* The application-wide stylesheet. */
@import '@rivinia/theme';
```

The package contains stylesheets. Its JavaScript module is empty and its declaration file exports no API, so there is no theme provider or service to register. A CSS-aware bundler resolves the root import through the package's `style` export; `@rivinia/theme/theme.css` is the explicit file entry.

## Three levels of control

A component reads its own token first, the shared semantic token second, and its built-in fallback last.

```text
--rv-select-bg  →  --rv-bg  →  component fallback
```

| Choose this level | Change | Reach |
| --- | --- | --- |
| One component | A documented component token such as `--rv-select-bg` | That component's surface |
| Shared palette | `--rv-bg`, `--rv-fg`, `--rv-accent` and the other semantic tokens | Descendants that read those properties |
| Defaults | Import the stylesheet without overrides | The package's light/dark palette |

Put application-wide overrides in a global stylesheet, unlayered, on `:root`. Use a subtree selector when a campaign, tenant panel or dark section intentionally needs its own values. The defaults are inside `@layer rivinia-theme`, so ordinary unlayered application declarations win over them.

**Warning:** A component token on `:root` still takes precedence inside a section that overrides only the semantic token. The component reads its own name first wherever that value was inherited from.

## Which interfaces consume these tokens?

The shipped UI bundles for Select, Datepicker, Table, Modal, Toast, Menu and the i18n toggle contain reads of the shared `--rv-*` properties. This is verified from the installed 1.0.4 bundles listed in this page's sources. Their headless entries and Popup do not contain these CSS reads.

| You use | What theme supplies |
| --- | --- |
| A ready-made Rivinia UI | Shared token values consumed by that UI's CSS |
| A headless controller with your own markup | Values you can use explicitly in your own CSS |
| An existing styling stack | A dedicated Tailwind v4 or Bootstrap 5.3 adapter; Sass and Less can import the base stylesheet |

Choose one stylesheet entry. The Tailwind and Bootstrap adapters already include the base theme; importing an adapter and the base duplicates the CSS.

## Light and dark follow the document

With no explicit selection, the stylesheet follows `prefers-color-scheme`. Set `data-rv-theme="light"` or `data-rv-theme="dark"` on the root `html` element to select a mode. Remove the attribute to follow the system again. This attribute is read on the document root; sections use token overrides instead.

Bootstrap's adapter uses `data-bs-theme` and its own variable mapping. Its unlayered mappings take precedence over the base theme's `data-rv-theme` rules.

## Documented compatibility

The installed README lists the following support floor. These are the library's documented targets, not a claim that this documentation site has run every browser.

| Engine | Documented version |
| --- | --- |
| Chrome / Edge | 114 |
| Firefox | 125 |
| Safari macOS | 17 |
| Safari iOS | 18.3 |

The same README explicitly says real Safari has not been run and no CI executes that matrix. Theme CSS support is separate from the positioning requirements of popup components.
