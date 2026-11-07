# Docs package coverage

`✓` means the block is rendered from verified manifest, installed metadata, or source files. `—` means the installed package metadata or repository does not provide that block, so the page omits it by design.

| Package               | Header | Install | Imports | Quick start | Depends on                   | Headless/UI | See it live |
| --------------------- | ------ | ------- | ------- | ----------- | ---------------------------- | ----------- | ----------- |
| `@rivinia/env`        | ✓      | ✓       | ✓       | —           | —                            | —           | —           |
| `@rivinia/http`       | ✓      | ✓       | ✓       | —           | —                            | —           | —           |
| `@rivinia/i18n`       | ✓      | ✓       | ✓       | —           | `@rivinia/select` peer range | ✓           | —           |
| `@rivinia/select`     | ✓      | ✓       | ✓       | ✓           | `@rivinia/popup` range       | ✓           | ✓           |
| `@rivinia/theme`      | ✓      | ✓       | ✓       | —           | —                            | —           | —           |
| `@rivinia/datepicker` | ✓      | ✓       | ✓       | ✓           | —                            | ✓           | ✓           |
| `@rivinia/table`      | ✓      | ✓       | ✓       | ✓           | —                            | ✓           | ✓           |
| `@rivinia/modal`      | ✓      | ✓       | ✓       | ✓           | —                            | ✓           | ✓           |
| `@rivinia/toast`      | ✓      | ✓       | ✓       | ✓           | —                            | ✓           | ✓           |
| `@rivinia/menu`       | ✓      | ✓       | ✓       | —           | `@rivinia/popup` range       | ✓           | —           |
| `@rivinia/popup`      | ✓      | ✓       | ✓       | —           | —                            | —           | —           |

## Notes

- Install commands are shown only when the installed package version matches the version independently verified on the npm registry (`1.0.3` for all eleven packages during this task).
- Dependency entries show the package manifest's required semver range separately from the installed/published package version. A range such as `^1.0.0` is valid metadata and does not mean the resolved package is version `1.0.0`.
- Quick starts and live links exist only for packages with genuine registered showcase demos.
- Headless/UI appears only when package exports include a separate `./ui` entry point.
