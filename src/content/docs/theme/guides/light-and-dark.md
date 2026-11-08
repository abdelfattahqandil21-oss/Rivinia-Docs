---
title: 'Light and dark'
summary: 'Follow the operating system by default, or set an explicit theme mode on the document root.'
order: 3
group: 'Appearance'
sources:
  - node_modules/@rivinia/theme/package.json
  - node_modules/@rivinia/theme/styles/theme.css
  - node_modules/@rivinia/theme/README.md
  - src/content/_library-source/theme/1.0.4/docs/README.md
---

## Let the operating system choose

With no `data-rv-theme` attribute on the document root, the stylesheet follows `prefers-color-scheme`. Its dark rule excludes `:root[data-rv-theme='light']`, while the explicit `:root[data-rv-theme='dark']` rule opts into dark even when the OS prefers light.

| Desired mode                 | Document root                                                              |
| ---------------------------- | -------------------------------------------------------------------------- |
| Follow the OS                | Remove `data-rv-theme`.                                                    |
| Always light                 | Set `data-rv-theme="light"` on `<html>`.                                   |
| Always dark                  | Set `data-rv-theme="dark"` on `<html>`.                                    |
| Dark section in a light page | Set the semantic `--rv-*` tokens and `color-scheme: dark` on that section. |

:::example theme-color-scheme

## Keep native controls in the same scheme

Both theme rules set `color-scheme` on `:root`. This lets native controls, scrollbars and the canvas follow the selected palette. If you write a custom dark palette, set `color-scheme: dark` in the same rule as the dark token values.

The example reports the browser's actual OS preference using `matchMedia`. A sandboxed frame cannot emulate the operating system setting; use its **Follow system** action to remove the attribute and verify what that browser currently prefers.

## Scope one section

`data-rv-theme` is read on the document root only. To darken one region, set its semantic tokens and `color-scheme` on the section instead of putting the root attribute on a descendant.
