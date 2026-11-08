---
title: 'CSS-aware bundlers'
summary: "Import the base stylesheet once from the application's global CSS and map shared tokens at the root."
order: 4
group: 'CSS tooling'
sources:
  - node_modules/@rivinia/theme/package.json
  - node_modules/@rivinia/theme/README.md
  - node_modules/@rivinia/theme/styles/theme.css
  - node_modules/@rivinia/select/package.json
  - node_modules/@rivinia/select/README.md
  - node_modules/@rivinia/select/fesm2022/rivinia-select-ui.mjs
  - src/content/_library-source/theme/1.0.4/docs/README.md
  - src/content/_library-source/select/1.0.4/docs/theming.md
---

## Add the stylesheet globally

Install `@rivinia/theme`, then import the package root from the application's global stylesheet. A CSS-aware bundler resolves that root through the package's `style` export; use `@rivinia/theme/theme.css` when your tool needs the explicit file.

```css
/* src/styles.css */
@import '@rivinia/theme';
```

The import already contains the base palette. Do not import the root and `theme.css` together, and do not register an Angular provider: this package ships styles, not a runtime service.

## Map your application palette

Override shared values in an unlayered global `:root` rule. Rivinia's defaults are inside `@layer rivinia-theme`, so an unlayered rule takes precedence without depending on import order.

```css
:root {
  --rv-bg: #ffffff;
  --rv-fg: #111111;
  --rv-accent: #5b5bd6;
}
```

:::example theme-css-consumer

## Verify in DevTools

Run this in your application's console:

```text
getComputedStyle(document.documentElement).getPropertyValue('--rv-bg').trim()
```

It returns the active root background token. To inspect a package token, select an `rv-select` host and read `getComputedStyle($0).getPropertyValue('--rv-select-bg')`; an empty value means the component falls through to the shared `--rv-bg` token.

Keep application-wide `--rv-*` declarations on `:root`. Put them on a section only when that region is intentionally meant to have its own palette.
