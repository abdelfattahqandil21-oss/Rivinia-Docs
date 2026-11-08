# Library ingest log

| Step | Status | Evidence                                                                                                                                                                                                                                          |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1   | PASS   | Captured all 11 installed 1.0.4 packages; README/CHANGELOG from node_modules and docs from the supplied extracted archive. Independent SHA-256 verification and npm run verify pass (18 files, 81 tests). Existing snapshots are never rewritten. |
| A2   | PASS   | Added build-only marked 16.4.1 (published 2025-10-17), structured Markdown AST, central docsLink-based rewriting, source stripping report, and real-snapshot Node tests. Added SCSS/Less/sh highlighting aliases.                                 |

A2 gate: npm run verify passed (3 Node tests; 18 Angular test files, 81 tests).
