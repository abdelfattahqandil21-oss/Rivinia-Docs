---
title: 'How theming works'
summary: 'Follow the component-to-semantic token chain and place overrides where the CSS cascade can apply them.'
order: 2
group: 'Foundations'
sources:
  - node_modules/@rivinia/theme/package.json
  - node_modules/@rivinia/theme/styles/theme.css
  - node_modules/@rivinia/theme/styles/tailwind.css
  - src/content/_library-source/theme/1.0.4/docs/README.md
  - src/content/_library-source/theme/1.0.4/docs/component-theme.md
  - node_modules/@rivinia/select/fesm2022/rivinia-select-ui.mjs
---

## Start at the component token

A ready-made UI checks its package token first, then falls back to the shared semantic token, then to its built-in value:

```text
--rv-select-bg  →  --rv-bg  →  component default
```

Use a package token when one component needs a distinct surface. Use a semantic token when all consumers in a region should share the same value. If neither is set, the package default remains in effect.

## Place a global override on `:root`

The theme defaults live in `@layer rivinia-theme`. A global, unlayered `:root` rule can override them regardless of the order of ordinary stylesheet rules:

```css
:root {
  --rv-bg: #fffaf0;
  --rv-accent: #7c3aed;
}
```

For a section with its own palette, put semantic tokens on the section selector, also outside a layer. Descendants inherit those values while the rest of the page keeps the root palette.

:::example theme-override-placement

## Four placements that look plausible

The package source documents these four cases. The first three fail for different reasons; the fourth works but changes how subtree overrides resolve.

| Placement                                                 | Result                                                                                                                       |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `@layer base { :root { --rv-bg: … } }`                    | Loses to the later `rivinia-theme` layer when the layer order is `base, rivinia-theme`.                                      |
| `@theme { --rv-bg: … }`                                   | Ignored by Tailwind because `--rv-bg` is not a Tailwind theme key.                                                           |
| `:root { --rv-bg: … }` in an Angular component stylesheet | Does not match after Angular scopes the selector to component content. Put this rule in the application’s global stylesheet. |
| `@theme { --color-rv-bg: … }`                             | Works in Tailwind but replaces the utility alias at `:root`, so a subtree `--rv-bg` no longer reaches that utility.          |

The live frame proves the CSS layer and subtree cases using the installed `theme.css`. It does not run the Tailwind compiler or Angular’s style scoping, so those two tool-specific cases stay code and source explanations rather than simulated previews.

## Keep the component token in mind

A component token is narrower than the shared palette. If `--rv-select-bg` is set on `:root`, a section that changes only `--rv-bg` cannot override it for Select: the component token still wins. Set a component token only where that component-specific choice is intended, or clear it in the scoped region when the shared background should take over.
