import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { readPages } from './authored/content.mjs';
const root = resolve(import.meta.dirname, '..');
const pages = await readPages(root);
await mkdir(join(root, 'src/generated'), { recursive: true });
await writeFile(
  join(root, 'src/generated/docs-content.generated.ts'),
  `// Generated authored content. Do not edit.\nimport type { DocsPage } from '../app/features/docs/shared/models/docs-content.model';\nexport const DOCS_CONTENT: readonly DocsPage[] = ${JSON.stringify(pages, null, 2)};\n`,
);
console.log(`Authored docs: ${pages.length} pages`);
