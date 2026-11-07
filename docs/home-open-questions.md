# Home page open questions

- Root `package.json` reports `0.0.0`, which is not evidence of a published Rivinia package version. Do not show a global version badge. Package registry metadata was checked for the relevant package and must be rechecked if the page displays package-specific version/license information.
- The hero install command is conditional on verified npm publication. Omit it if current registry state cannot be verified.
- R6 narrows performance copy to package entry-point metadata and accessibility copy to documented ready-UI behavior plus consumer-owned headless markup; see the R6 evidence and installed package READMEs.
- Lighthouse is optional only when a local executable already exists; do not install it for this task.
- The app currently has general `/docs` and `/components` routes, not package-specific documentation routes. The showcase links to the real general docs and package catalog.
- R5 replaced the unmeasured “Fast by default” claim with source-backed signal state. R6 now describes tree-shakeable package entries and distinguishes documented ready-UI behavior from consumer-owned headless markup.
- The Playground route is currently a placeholder page; keep its Home action non-interactive and label it “coming soon” until the route contains a real tool.
- Confirm installed Select typings expose an active option and selected IDs before presenting those fields in the headless state panel. Never derive or label synthetic state as package state.
- Automated Axe/Lighthouse results are unavailable unless a preinstalled local runner is found; no auditing dependency will be added for this revision.
