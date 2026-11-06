# Home page open questions

- Root `package.json` reports `0.0.0`, which is not evidence of a published Rivinia package version. Do not show a global version badge. Package registry metadata was checked for the relevant package and must be rechecked if the page displays package-specific version/license information.
- The hero install command is conditional on verified npm publication. Omit it if current registry state cannot be verified.
- The performance and accessibility statements in Decisions require direct evidence. Narrow or remove any statement not supported by source/tests/docs.
- Lighthouse is optional only when a local executable already exists; do not install it for this task.
