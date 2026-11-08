import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { docsLink } from '../../src/app/features/docs/shared/docs-link.ts';
import { parseMarkdown } from './markdown.mjs';
import { auditImports, tokenRows } from './reference.mjs';

export function frontmatter(source, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error(`${file}: frontmatter required`);
  let meta;
  try {
    meta = JSON.parse(match[1]);
  } catch {
    meta = {};
    let list;
    for (const line of match[1].split('\n')) {
      const item = /^\s+-\s+(.+)$/.exec(line);
      if (item && list) {
        meta[list].push(item[1].replace(/^['"]|['"]$/g, ''));
        continue;
      }
      const entry = /^(\w+):\s*(.*)$/.exec(line);
      if (!entry) throw new Error(`${file}: invalid frontmatter line ${line}`);
      const [, key, value] = entry;
      list = undefined;
      if (!value) {
        meta[key] = [];
        list = key;
      } else {
        try {
          meta[key] = JSON.parse(value);
        } catch {
          meta[key] = value.replace(/^['"]|['"]$/g, '');
        }
      }
    }
  }
  for (const key of Object.keys(meta))
    if (!['title', 'summary', 'order', 'group', 'chip', 'sources'].includes(key))
      throw new Error(`${file}: unknown frontmatter ${key}`);
  if (
    typeof meta.title !== 'string' ||
    !meta.title ||
    typeof meta.summary !== 'string' ||
    !meta.summary ||
    !Number.isFinite(meta.order) ||
    !Array.isArray(meta.sources) ||
    !meta.sources.length
  )
    throw new Error(`${file}: title, summary, numeric order and nonempty sources required`);
  return { meta, body: source.slice(match[0].length) };
}
export async function readPages(root) {
  const base = join(root, 'src/content/docs');
  const pages = [];
  const links = [];
  if (!existsSync(base)) return pages;
  async function walk(folder) {
    const result = [];
    for (const item of await readdir(folder, { withFileTypes: true })) {
      if (item.name === 'examples') continue;
      const path = join(folder, item.name);
      if (item.isDirectory()) result.push(...(await walk(path)));
      else if (item.name.endsWith('.md')) result.push(path);
    }
    return result;
  }
  for (const pkg of await readdir(base)) {
    for (const file of await walk(join(base, pkg))) {
      const { meta, body } = frontmatter(await readFile(file, 'utf8'), file);
      for (const source of meta.sources)
        if (
          typeof source !== 'string' ||
          !/^(node_modules\/@rivinia\/|src\/content\/_library-source\/)/.test(source) ||
          source.includes('..') ||
          !existsSync(resolve(root, source))
        )
          throw new Error(
            `${file}: source does not exist or is not a library reference: ${source}`,
          );
      const name = relative(join(base, pkg), file).replaceAll('\\', '/').replace(/\.md$/, '');
      const section = name === 'index' ? '' : name === 'api' ? 'reference' : name;
      if (
        !/^(?:|quick-start|reference|changelog|guides\/[a-z0-9-]+|recipes\/[a-z0-9-]+)$/.test(
          section,
        )
      )
        throw new Error(`${file}: unsupported page path ${section}`);
      const route = docsLink(pkg, ...section.split('/'));
      const { nodes } = parseMarkdown(body, relative(root, file), (href) => {
        if (/^https:\/\//.test(href)) return { href, external: true };
        if (href.startsWith('#')) {
          const target = `${route}${href}`;
          links.push({ file, href: target });
          return { href: target, external: false };
        }
        if (!href.startsWith('docs:'))
          throw new Error(`${file}: links must use docs: or https: ${href}`);
        const [path, anchor] = href.slice(5).split('#');
        const [targetPkg, ...parts] = path.split('/');
        const target =
          docsLink(
            targetPkg,
            ...parts
              .filter((part) => part && part !== 'index')
              .map((part) => part.replace(/\.md$/, '')),
          ) + (anchor ? `#${anchor}` : '');
        links.push({ file, href: target });
        return { href: target, external: false };
      });
      for (const node of nodes)
        if (
          node.type === 'example' &&
          !existsSync(join(base, pkg, 'examples', node.name, 'meta.json'))
        )
          throw new Error(`${file}: missing example ${node.name}`);
      async function expand(items) {
        const result = [];
        for (const node of items) {
          if (node.type === 'code' && ['ts', 'typescript'].includes(node.language))
            await auditImports(node.code, root, file);
          if (node.type === 'tokens') {
            const rows = await tokenRows(root);
            const cell = (text) => [{ type: 'code', text }];
            result.push({
              type: 'table',
              header: ['Token', 'Light', 'Dark'].map(cell),
              rows: rows.map((row) => [
                cell(row.name),
                ...[row.light, row.dark].map((value) =>
                  /^#[a-f0-9]+$/i.test(value)
                    ? [{ type: 'swatch', color: value }, ...cell(value)]
                    : cell(value),
                ),
              ]),
            });
          } else if (node.type === 'entrypoints') {
            const usesPath = join(base, pkg, 'entrypoints.json');
            if (!existsSync(usesPath))
              throw new Error(`${file}: :::entrypoints requires authored entrypoints.json`);
            const uses = JSON.parse(await readFile(usesPath, 'utf8'));
            const manifest = JSON.parse(
              await readFile(join(root, 'node_modules/@rivinia', pkg, 'package.json'), 'utf8'),
            );
            const cell = (text) => [{ type: 'text', text }];
            const rows = Object.entries(manifest.exports)
              .filter(([key]) => key !== './package.json')
              .map(([key, value]) => {
                if (typeof uses[key] !== 'string' || !uses[key])
                  throw new Error(`${file}: missing authored entrypoint use for ${key}`);
                return [
                  cell(key === '.' ? manifest.name : manifest.name + key.slice(1)),
                  cell(typeof value === 'string' ? value : (value.style ?? value.default)),
                  cell(uses[key]),
                ];
              });
            result.push({
              type: 'table',
              header: ['Specifier', 'File', 'Use it when'].map(cell),
              rows,
            });
          } else {
            if (node.children) node.children = await expand(node.children);
            if (node.items) node.items = await Promise.all(node.items.map(expand));
            result.push(node);
          }
        }
        return result;
      }
      pages.push({ ...meta, package: pkg, section, route, nodes: await expand(nodes) });
    }
  }
  const byRoute = new Map(pages.map((page) => [page.route, page]));
  if (byRoute.size !== pages.length) throw new Error('Duplicate authored page route');
  for (const link of links) {
    const [route, anchor] = link.href.split('#');
    const page = byRoute.get(route);
    if (
      !page ||
      (anchor && !page.nodes.some((node) => node.type === 'heading' && node.id === anchor))
    )
      throw new Error(`${link.file}: unresolved internal link ${link.href}`);
  }
  return pages.sort((a, b) => a.order - b.order || a.route.localeCompare(b.route));
}
