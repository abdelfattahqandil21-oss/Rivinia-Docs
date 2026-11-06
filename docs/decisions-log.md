# Decisions log

- **Phase 2 Step 2 — Select displayed source:** The Select component imported the showcase highlighter and source model. Moved the code-block definitions and highlighting into `select-example.registry.ts`, loaded by the lazy showcase loader, and passed the result to the component as an input. This keeps the visitor-facing component free of application-local imports while preserving its rendered examples.
