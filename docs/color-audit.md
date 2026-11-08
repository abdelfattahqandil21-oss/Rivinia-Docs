# Docs and Home color audit

## Token inventory and unification

The global token values before this step came from `src/styles/tokens.css`; Home overrode them in `:root:has(.home-page)` in the same file. The shared root now uses the verified Home palette so the navbar, Docs, Components, Playground, shared code/copy controls, and Home render the same semantic surfaces and colors. Home-specific section geometry remains scoped to the Home route.

| Token                                                                                                         | Previous global light / dark                                                    | Home light / dark                                                                     | Unified role                                  |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- |
| `--rv-bg`                                                                                                     | `#fcfaf6` / `#0b0813`                                                           | `#f7f7f6` / `#111114`                                                                 | Page and base surface                         |
| `--rv-fg`                                                                                                     | `#211b27` / `#f5f1e8`                                                           | `#222225` / `#f2f1ef`                                                                 | Primary text                                  |
| `--rv-muted`                                                                                                  | `#62596b` / `#b9aec8`                                                           | `#5a5a60` / `#b7b5bb`                                                                 | Muted text                                    |
| `--rv-border`                                                                                                 | `#e4dccf` / `#3a3044`                                                           | `#dedee2` / `#36363b`                                                                 | Hairline borders                              |
| `--rv-accent`                                                                                                 | `#8a6a3e` / `#e8d2a0`                                                           | `#75561c` / `#d8b96e`                                                                 | Links, focus, active indicator                |
| `--rv-brand-violet`                                                                                           | `#5b34a8` / `#b18aff`                                                           | `#5b34a8` / `#b18aff`                                                                 | Syntax and meaningful secondary emphasis      |
| `--rv-home-cta-bg`                                                                                            | Home-only `#cfb25e` / `#d8b96e`                                                 | `#cfb25e` / `#d8b96e`                                                                 | Primary action surface                        |
| `--rv-home-cta-foreground`                                                                                    | Home-only `#161616` / `#161616`                                                 | `#161616` / `#161616`                                                                 | Text on primary action                        |
| `--rv-home-surface-raised`                                                                                    | Home-only `#ffffff` / `#19191d`                                                 | `#ffffff` / `#19191d`                                                                 | Raised surface and code surface               |
| `--rv-home-surface-overlay`                                                                                   | Home-only `#f0f0ee` / `#222226`                                                 | `#f0f0ee` / `#222226`                                                                 | Overlay, active item, inline code, zebra rows |
| `--rv-scrollbar-thumb`                                                                                        | `color-mix(--rv-accent 70%, --rv-border)`                                       | Same derived token                                                                    | Scrollbar thumb                               |
| `--rv-scrollbar-track`                                                                                        | `var(--rv-bg)`                                                                  | Same derived token                                                                    | Scrollbar track                               |
| `--rv-docs-active-bg`                                                                                         | New alias to `--rv-home-surface-overlay`                                        | Same                                                                                  | Sidebar active background; no added hue       |
| `--rv-selection-bg`                                                                                           | New `color-mix(--rv-accent 28%, --rv-bg)` derivation                            | Same                                                                                  | Text selection background                     |
| `--rv-docs-backdrop`                                                                                          | New `color-mix(--rv-fg 60%, transparent)` derivation                            | Dark theme overrides with `color-mix(--rv-bg 78%, transparent)` to avoid a light veil | Native dialog backdrop                        |
| `--code-keyword`, `--code-string`, `--code-tag`, `--code-attr`, `--code-fn`, `--code-comment`, `--code-plain` | Previously split between Home selectors and per-code-block `--rv-code-*` values | Centralized aliases to the same existing palette                                      | Shared Home and Docs syntax colors            |

## Home usage by role

- Page and base surfaces use `--rv-bg`; raised cards use `--rv-home-surface-raised`; overlay surfaces use `--rv-home-surface-overlay`.
- Headings/body use `--rv-fg`; supporting text uses `--rv-muted`.
- Text links, focus outlines and active indicators use `--rv-accent`; hover text returns to `--rv-fg` with an underline.
- Primary CTAs use `--rv-home-cta-bg` and `--rv-home-cta-foreground`.
- Shared code surfaces use `--rv-home-surface-raised`; syntax uses the canonical `--code-*` variables.
- Borders and scrollbars use `--rv-border` and the existing derived scrollbar tokens.

## Docs semantic role mapping

| Docs role                                                  | Existing token                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Page background and base surface                           | `--rv-bg`                                                                     |
| Raised code/card surface                                   | `--rv-home-surface-raised`                                                    |
| Overlay, inline-code, active-item, and table zebra surface | `--rv-home-surface-overlay`                                                   |
| Hairline, code, and table borders                          | `--rv-border`                                                                 |
| Primary and muted text                                     | `--rv-fg`, `--rv-muted`                                                       |
| Text links and hover behavior                              | `--rv-accent`; on hover use `--rv-fg` and underline, matching Home text links |
| Gold accent and text on gold                               | `--rv-accent`, `--rv-home-cta-foreground`                                     |
| Focus ring and sidebar indicator                           | `--rv-accent`                                                                 |
| Selection background                                       | `--rv-selection-bg`, derived from accent and page background                  |
| Code surface and syntax                                    | `--rv-home-surface-raised`, `--rv-border`, and canonical `--code-*` tokens    |
| Scrollbar thumb and track                                  | `--rv-scrollbar-thumb`, `--rv-scrollbar-track`                                |
| Dialog backdrop                                            | `--rv-docs-backdrop`, derived from foreground with alpha                      |

## Docs source color literals

The Docs page and shared page header had no color literals. The shared copy control used two hard-coded green success colors; both now use `--rv-brand-violet`, which is already used for meaningful code emphasis. The existing active navigation fill used an inline `color-mix()` expression; it now references `--rv-docs-active-bg`.

| Source                                                            | Existing literal     | Replacement              |
| ----------------------------------------------------------------- | -------------------- | ------------------------ |
| `src/app/shared/components/copy-button/copy-button.component.css` | `#176b42`, `#78d7a5` | `var(--rv-brand-violet)` |

The `check:colors` script maintains the non-token source inventory below and fails on literals under Docs UI folders.

<!-- global-color-literal-counts:start -->

| Source file                                                           | Count | Distinct literals                                 |
| --------------------------------------------------------------------- | ----: | ------------------------------------------------- |
| `src/app/features/showcase/demos/modal/modal-example.component.css`   |     2 | `#a83932`, `#fff`                                 |
| `src/app/features/showcase/demos/select/select-example.component.css` |     1 | `rgb(0 0 0 / 12%)`                                |
| `src/app/features/showcase/demos/table/table-example.component.css`   |     1 | `#b33a31`                                         |
| `src/styles/showcase.css`                                             |     3 | `#d09c45`, `rgb(0 0 0 / 18%)`, `rgb(0 0 0 / 28%)` |

<!-- global-color-literal-counts:end -->

## Contrast results

`check:contrast` computes the token pairs for both themes. Existing global-token deficiencies are reported here without failing the gate; any failing pair introduced for Docs UI fails the gate.

<!-- contrast-results:start -->

| Pair                                 | Theme |   Ratio | Minimum | Result               |
| ------------------------------------ | ----- | ------: | ------: | -------------------- |
| Primary text / page background       | Light | 14.80:1 |   4.5:1 | Pass                 |
| Primary text / page background       | Dark  | 16.70:1 |   4.5:1 | Pass                 |
| Muted text / page background         | Light |  6.39:1 |   4.5:1 | Pass                 |
| Muted text / page background         | Dark  |  9.28:1 |   4.5:1 | Pass                 |
| Text link / page background          | Light |  6.31:1 |   4.5:1 | Pass                 |
| Text link / page background          | Dark  |  9.95:1 |   4.5:1 | Pass                 |
| CTA text / CTA surface               | Light |  8.77:1 |   4.5:1 | Pass                 |
| CTA text / CTA surface               | Dark  |  9.55:1 |   4.5:1 | Pass                 |
| --code-keyword / code surface        | Light |  8.40:1 |   4.5:1 | Pass                 |
| --code-keyword / code surface        | Dark  |  6.63:1 |   4.5:1 | Pass                 |
| --code-string / code surface         | Light |  6.76:1 |   4.5:1 | Pass                 |
| --code-string / code surface         | Dark  |  9.25:1 |   4.5:1 | Pass                 |
| --code-tag / code surface            | Light |  8.40:1 |   4.5:1 | Pass                 |
| --code-tag / code surface            | Dark  |  6.63:1 |   4.5:1 | Pass                 |
| --code-attr / code surface           | Light |  8.40:1 |   4.5:1 | Pass                 |
| --code-attr / code surface           | Dark  |  6.63:1 |   4.5:1 | Pass                 |
| --code-fn / code surface             | Light |  8.40:1 |   4.5:1 | Pass                 |
| --code-fn / code surface             | Dark  |  6.63:1 |   4.5:1 | Pass                 |
| --code-comment / code surface        | Light |  6.85:1 |   4.5:1 | Pass                 |
| --code-comment / code surface        | Dark  |  8.63:1 |   4.5:1 | Pass                 |
| --code-plain / code surface          | Light | 15.87:1 |   4.5:1 | Pass                 |
| --code-plain / code surface          | Dark  | 15.53:1 |   4.5:1 | Pass                 |
| Sidebar active text / active surface | Light | 13.90:1 |   4.5:1 | Pass                 |
| Sidebar active text / active surface | Dark  | 14.04:1 |   4.5:1 | Pass                 |
| Focus ring / page background         | Light |  6.31:1 |     3:1 | Pass                 |
| Focus ring / page background         | Dark  |  9.95:1 |     3:1 | Pass                 |
| Sidebar indicator / page background  | Light |  6.31:1 |     3:1 | Pass                 |
| Sidebar indicator / page background  | Dark  |  9.95:1 |     3:1 | Pass                 |
| Meaningful border / page background  | Light |  1.25:1 |     3:1 | Pre-existing failure |
| Meaningful border / page background  | Dark  |  1.57:1 |     3:1 | Pre-existing failure |

<!-- contrast-results:end -->

## Findings and scope

- `color-scheme` was already set to light/dark in the root token file and remains synchronized with the active theme.
- The only new color derivations are selection and modal backdrop alpha mixes from existing tokens. No hue is added.
- Changing the shared root semantic tokens affects the navbar, preferences menu, Docs, Components, Playground, Home, Showcase, and every shared Rivinia-styled control that consumes `--rv-bg`, `--rv-fg`, `--rv-muted`, `--rv-border`, or `--rv-accent`. The values now match the existing Home palette; no Home palette value was changed.
