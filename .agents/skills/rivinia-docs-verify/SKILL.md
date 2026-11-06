---
name: rivinia-docs-verify
description: Run and diagnose the required Rivinia Docs formatting, architecture, generated-source, build, and test gates.
---

# Verify Rivinia Docs

## When to use

Use this skill before finishing any task, before committing, or when a Rivinia Docs verification gate fails.

## Instructions

1. Run `npm run verify` from the repository root. Do not invoke raw `ng`, because npm lifecycle hooks generate showcase sources.
2. Read the first failing command; later gates are skipped because the script uses `&&`.
3. For Prettier failures, format only the scoped files you own, then rerun `npm run verify`.
4. For architecture-check failures, use the reported file and line. Fix the import direction, component-relative asset path, `tests/` directory, generated-file placement/import boundary, or remove a temporary allowlist entry whose migration step is complete.
5. For stale generated-source failures, update source inputs and run the normal npm lifecycle command that regenerates outputs; never edit generated output manually.
6. For build failures, fix the TypeScript, Angular template, or production-build issue without weakening configuration.
7. For test failures, fix the behavior or spec. Keep the configured Vitest runner non-watch and headless.
8. Rerun the complete `npm run verify` after every correction and report exact results.

## Gate order

`npm run verify` runs Prettier check, architecture check, generated-source check, production build, then non-watch Vitest tests. Its build and test commands go through npm scripts so the existing `prebuild` and `pretest` source-generation hooks run.

## Checklist

- [ ] Verification ran from the repo root through `npm run verify`.
- [ ] All five gates passed; no failure was bypassed or weakened.
- [ ] Generated output was changed only by the generator.
- [ ] Remaining warnings or limitations are reported accurately.
