import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join, relative, dirname, extname } from 'node:path';
import { tokenRows } from './authored/reference.mjs';
const root = resolve(import.meta.dirname, '..');
const base = join(root, 'src/content/docs');
const entries = [];
async function walk(folder) {
  const files = [];
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}
async function inlineCss(source, folder) {
  const imports = [...source.matchAll(/@import\s+['"]([^'"]+)['"];?/g)];
  for (const match of imports) {
    const spec = match[1];
    let file;
    if (spec.startsWith('@rivinia/')) {
      const [, pkg, ...parts] = spec.split('/');
      const installed = join(root, 'node_modules/@rivinia', pkg);
      const manifest = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
      const target = manifest.exports[parts.length ? `./${parts.join('/')}` : '.'];
      file = join(installed, typeof target === 'string' ? target : target.style);
    } else if (spec.startsWith('./')) file = resolve(folder, spec);
    else throw new Error(`Frame CSS import cannot make external requests: ${spec}`);
    source = source.replace(match[0], await inlineCss(await readFile(file, 'utf8'), dirname(file)));
  }
  return source;
}
for (const pkg of await readdir(base)) {
  const folder = join(base, pkg, 'examples');
  if (!existsSync(folder)) continue;
  for (const name of await readdir(folder)) {
    const exampleFolder = join(folder, name);
    if (!existsSync(join(exampleFolder, 'meta.json'))) continue;
    const meta = JSON.parse(await readFile(join(exampleFolder, 'meta.json'), 'utf8'));
    if (
      !meta.title ||
      !meta.scenario ||
      !['frame', 'component'].includes(meta.mode) ||
      !Number.isFinite(meta.minHeight) ||
      !Array.isArray(meta.tryIt) ||
      meta.tryIt.length < 2 ||
      meta.tryIt.length > 4 ||
      !Array.isArray(meta.variants) ||
      meta.variants.some((variant) => !['theme', 'dir'].includes(variant))
    )
      throw new Error(`${exampleFolder}: invalid example meta.json`);
    const files = [];
    for (const file of await walk(exampleFolder)) {
      if (file.endsWith('meta.json')) continue;
      const source = await readFile(file, 'utf8');
      if (/\.(?:ts|css)$/.test(file) && /::ng-deep|!important/.test(source))
        throw new Error(`${file}: forbidden style escape`);
      if (file.endsWith('.ts')) {
        for (const item of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
          const spec = item[1];
          if (
            !spec.startsWith('@angular/') &&
            !spec.startsWith('@rivinia/') &&
            !(spec.startsWith('./') && resolve(dirname(file), spec).startsWith(exampleFolder + '/'))
          )
            throw new Error(`${file}: forbidden example import ${spec}`);
        }
        if (
          meta.mode === 'component' &&
          /documentElement|localStorage|sessionStorage|\bwindow\b|\bDOCUMENT\b|\bdocument\b/.test(
            source,
          )
        )
          throw new Error(`${file}: component previews must not access document-root or storage`);
        if (/(?:service|logic)\.ts$/.test(file) && !existsSync(file.replace(/\.ts$/, '.spec.ts')))
          throw new Error(`${file}: logic requires co-located spec`);
      }
      files.push({
        path: relative(exampleFolder, file),
        source,
        language:
          {
            '.ts': 'ts',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.less': 'less',
            '.json': 'json',
          }[extname(file)] ?? 'text',
      });
    }
    let srcdoc = '';
    let load;
    if (meta.mode === 'frame') {
      const entry = files.find((file) => file.path === 'index.html');
      if (!entry) throw new Error(`${exampleFolder}: frame index.html missing`);
      if (
        /<(?:script|link|img|iframe)\b[^>]*(?:src|href)\s*=/i.test(entry.source) ||
        /\bfetch\s*\(/.test(entry.source)
      )
        throw new Error(`${exampleFolder}: frame previews must be self-contained`);
      srcdoc = await inlineCss(entry.source, exampleFolder);
    } else {
      const entry = join(exampleFolder, `${name}.example.ts`);
      if (!existsSync(entry)) throw new Error(`${exampleFolder}: component entry missing`);
      load = relative(join(root, 'src/generated'), entry)
        .replaceAll('\\', '/')
        .replace(/\.ts$/, '');
    }
    entries.push({ id: `${pkg}/${name}`, meta, files, srcdoc, load });
  }
}
await mkdir(join(root, 'src/generated'), { recursive: true });
const output = entries
  .map(
    ({ load, ...entry }) =>
      `{...${JSON.stringify(entry)}, load: ${load ? `() => import(${JSON.stringify(load)}).then(m => m.default)` : 'undefined'}}`,
  )
  .join(',\n');
const tokens = await tokenRows(root);
await writeFile(
  join(root, 'src/generated/docs-examples.generated.ts'),
  `// Generated authored examples. Do not edit.\nimport type { DocsExample } from '../app/features/docs/shared/models/docs-example.model';\nexport const DOCS_EXAMPLES: readonly DocsExample[] = [${output}];\nexport const THEME_PREVIEW_TOKENS = ${JSON.stringify(tokens)};\n`,
);
console.log(`Authored examples: ${entries.length}`);
