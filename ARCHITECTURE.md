# Architecture

## Layers

| Folder            | Holds                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| `src/app/core/`   | App-wide singletons: `config/`, `models/`, `services/`. No UI.                         |
| `src/app/shared/` | Reusable pieces used by more than one page: `components/`, `directives/`.              |
| `src/app/pages/`  | One routed area per folder: `home/`, `docs/`, `components/`, `playground/`, `guides/`. |

Every page area follows the same shape:

```text
pages/<page>/
  <page>-page.component.ts    (routing entry, composition only)
  <page>-page.component.html
  <page>-page.component.css
  components/                 (page-local UI, when needed)
  services/                   (page state + IO)
  models/                     (interfaces, types, constants)
```

`core/` mirrors the same split without pages: `core/config/`, `core/models/`,
`core/services/`.

## Rules

1. **No inline templates or styles.** Every component ships three files —
   `<name>.component.ts`, `.html`, `.css` — wired with `templateUrl` and
   `styleUrl`. No `template:` or `styles:` strings in TypeScript, and no
   `style="…"` attributes in templates.
2. **Pages compose, they do not own data.** A page injects its service and
   renders its signals; interfaces live in `models/`.
3. **Dependencies point inward.** `pages/*` may import `core/` and `shared/`;
   `shared/` never imports a page; pages never import each other's internals.
4. **Shared means reused.** A component goes to `shared/` only when a second
   page needs it; otherwise it stays under that page's `components/`.
5. **Naming.** Folders and files are kebab-case, components end in
   `.component.ts`, classes are PascalCase and suffixed with `Component`.
6. **State.** Page services expose readonly signals; components derive with
   `computed()`, never with template logic.
