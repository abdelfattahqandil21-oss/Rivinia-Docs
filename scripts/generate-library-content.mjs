import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import { docsLink } from '../src/app/features/docs/shared/docs-link.ts';
import { parseMarkdown, slug } from './library/markdown.mjs';
import { rewriteLink, topicRoute } from './library/links.mjs';

const root = resolve(import.meta.dirname, '..');
const content = join(root, 'src/content/library');
export async function generate() {
  const registry = {};
  const inputs = [];
  const layouts = {};
  for (const pkg of await readdir(content)) {
    if (pkg.endsWith('.json')) continue;
    const folder = join(content, pkg, '1.0.4');
    if (!existsSync(folder)) continue;
    const layout = existsSync(join(content, pkg, 'layout.json'))
      ? JSON.parse(await readFile(join(content, pkg, 'layout.json'), 'utf8'))
      : {};
    layouts[pkg] = layout;
    for (const name of [
      'README.md',
      'CHANGELOG.md',
      ...(existsSync(join(folder, 'docs'))
        ? (await readdir(join(folder, 'docs'))).map((name) => `docs/${name}`)
        : []),
    ]) {
      if (!name.endsWith('.md')) continue;
      const topic = name.replace(/^docs\//, '').replace(/\.md$/, '');
      const route =
        name === 'README.md'
          ? docsLink(pkg)
          : name === 'CHANGELOG.md'
            ? docsLink(pkg, 'changelog')
            : topicRoute(pkg, layout.topics?.[topic]?.slug ?? topic.toLowerCase());
      const key = `${pkg}/${name}`;
      registry[key] = { route, anchors: {} };
      inputs.push({
        pkg,
        key,
        name,
        topic,
        route,
        source: await readFile(join(folder, name), 'utf8'),
      });
    }
  }
  const pages = [];
  const report = { stripped: [], internal: [], external: [], unresolved: [] };
  // Only theme is migrated; other snapshots supply the cross-library link registry.
  for (const input of inputs.filter((input) => input.pkg === 'theme')) {
    const parsed = parseMarkdown(input.source, input.key, (href) => {
      const link = rewriteLink(href, { file: input.key, route: input.route }, registry);
      report[link.external ? 'external' : 'internal'].push({
        file: input.key,
        source: href,
        target: link.href,
      });
      return link;
    });
    report.stripped.push(...parsed.stripped);
    const section =
      input.name === 'README.md'
        ? ''
        : input.name === 'CHANGELOG.md'
          ? 'changelog'
          : `guides/${layouts.theme.topics?.[input.topic]?.slug ?? input.topic.toLowerCase()}`;
    pages.push({
      package: input.pkg,
      section,
      route: input.route,
      title: input.name === 'README.md' ? '@rivinia/theme' : parsed.title,
      source: input.key,
      nodes: parsed.nodes,
    });
  }
  await mkdir(join(root, 'src/generated'), { recursive: true });
  await writeFile(
    join(root, 'src/generated/library-content.generated.ts'),
    `// Generated from immutable library snapshots. Do not edit.\nexport const LIBRARY_CONTENT = ${JSON.stringify(pages, null, 2)};\n`,
  );
  await writeFile(
    join(root, 'docs/library-ingest-report.md'),
    await format(
      '# Library ingest report\n\n' +
        `Theme pages: ${pages.length}. Stripped tokens: ${report.stripped.length}. Internal links: ${report.internal.length}. External links: ${report.external.length}. Unresolved: ${report.unresolved.length}.\n\n` +
        '## Removed source blocks\n\n' +
        report.stripped
          .map((item) => `- ${item.file}: ${item.reason}: ${JSON.stringify(item.raw)}`)
          .join('\n') +
        '\n\n## External links\n\n' +
        report.external.map((item) => `- ${item.file}: ${item.target}`).join('\n') +
        '\n',
      { parser: 'markdown' },
    ),
  );
  return { pages, registry, report };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await generate();
