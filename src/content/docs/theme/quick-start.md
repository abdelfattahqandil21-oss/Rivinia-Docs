---
title: 'Quick start'
summary: 'Install the stylesheet, choose the entry point for your stack, and verify the shared tokens in the browser.'
order: 1
sources:
  - node_modules/@rivinia/theme/package.json
  - node_modules/@rivinia/theme/README.md
  - node_modules/@rivinia/theme/styles/theme.css
  - node_modules/@rivinia/theme/styles/tailwind.css
  - node_modules/@rivinia/theme/styles/bootstrap.css
  - node_modules/@rivinia/theme/styles/_index.scss
  - src/content/_library-source/theme/1.0.4/docs/README.md
---

## 1. Install the package

From your Angular workspace, install the stylesheet package:

```bash
npm install @rivinia/theme
```

The package has no Angular provider or runtime API. Its root JavaScript module is empty; use a stylesheet entry instead.

## 2. Choose one entry for your stack

Pick the row for the tooling that processes your global stylesheet. Each adapter includes the base theme, so import only one entry.

| Stack             | Global stylesheet import                                               |
| ----------------- | ---------------------------------------------------------------------- |
| CSS-aware bundler | `@import '@rivinia/theme';`                                            |
| Tailwind CSS v4   | `@import 'tailwindcss';` then `@import '@rivinia/theme/tailwind.css';` |
| Bootstrap 5.3     | `@import '@rivinia/theme/bootstrap.css';`                              |
| Sass              | `@use '@rivinia/theme/scss';`                                          |
| Less              | `@import (less) '@rivinia/theme/theme.css';`                           |

For the Sass CLI, use the `pkg:` importer with Dart Sass 1.71 or newer. The Less root entry compiles to nothing; use the explicit `theme.css` file with `(less)`. The Less and Sass forms belong in their respective toolchains; the live card below demonstrates the base stylesheet only.

:::example theme-stack-entry

## 3. Map three tokens

Use the same semantic variables in a global rule or on a scoped section. Keep an override outside `@layer rivinia-theme` so it takes precedence over the package defaults.

```css
:root {
  --rv-bg: #ffffff;
  --rv-fg: #111111;
  --rv-accent: #5b5bd6;
}
```

## 4. Verify the result

Open DevTools on your application and run:

```text
getComputedStyle(document.documentElement).getPropertyValue('--rv-bg').trim();
```

The result should be the active background token from the selected light or dark scheme. The installed stylesheet defines its defaults on `:root` inside `@layer rivinia-theme`.
