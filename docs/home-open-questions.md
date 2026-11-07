# Home page open questions

- Root `package.json` reports `0.0.0`, which is not evidence of a published Rivinia package version. Do not show a global version badge. Package registry metadata was checked for the relevant package and must be rechecked if the page displays package-specific version/license information.
- The hero install command is conditional on verified npm publication. Omit it if current registry state cannot be verified.
- The performance and accessibility statements in Decisions require direct evidence. Narrow or remove any statement not supported by source/tests/docs.
- Lighthouse is optional only when a local executable already exists; do not install it for this task.
- The app currently has general `/docs` and `/components` routes, not package-specific documentation routes. The showcase links to the real general docs and package catalog.
- Replaced the unmeasured “Fast by default” claim with source-backed signal state. Accessibility copy now distinguishes documented ready-UI behavior from consumer-owned headless markup.
