import { resolve } from 'node:path';
import { readPages } from './authored/content.mjs';
const pages = await readPages(resolve(import.meta.dirname, '..'));
console.log(
  `Authored content check passed: ${pages.length} pages; sources, directives and internal links resolve.`,
);
