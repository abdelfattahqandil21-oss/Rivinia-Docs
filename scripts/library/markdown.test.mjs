import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseMarkdown } from './markdown.mjs';
import { rewriteLink } from './links.mjs';

test('real theme table, back paragraph and code fences remain structured', async () => {
  const source = await readFile(
    new URL('../../src/content/library/theme/1.0.4/docs/styling-stacks.md', import.meta.url),
    'utf8',
  );
  const parsed = parseMarkdown(source, 'theme/docs/styling-stacks.md');
  assert.equal(parsed.title, '@rivinia/theme — which styling stack?');
  assert.equal(parsed.stripped.filter((item) => item.reason === 'leading back links').length, 1);
  assert.equal(parsed.nodes.filter((node) => node.type === 'table').length, 1);
  assert.ok(parsed.nodes.some((node) => node.type === 'code' && node.language === 'less'));
});
test('real cross-package and version-pinned README links rewrite centrally', () => {
  const registry = {
    'select/docs/theming.md': { route: '/docs/select/guides/theming' },
    'theme/README.md': { route: '/docs/theme' },
  };
  const context = { file: 'theme/docs/tokens.md', route: '/docs/theme/guides/tokens' };
  assert.equal(
    rewriteLink('../select/theming.md', context, registry).href,
    '/docs/select/guides/theming',
  );
  assert.equal(
    rewriteLink('../../projects/theme/README.md', context, registry).href,
    '/docs/theme',
  );
  assert.equal(
    rewriteLink(
      'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.4/projects/theme/README.md',
      context,
      registry,
    ).href,
    '/docs/theme',
  );
  assert.throws(() => rewriteLink('missing.md', context, registry), /unresolved/);
});
test('plain fences, escaped pipes, nested lists and unique ids', () => {
  const parsed = parseMarkdown(
    '# Page\n\n## Install\n\n## Install\n\n```\noutput\n```\n\n| A | B |\n|---|---|\n| a\\|b | c |\n\n- one\n  - two\n',
    'sample.md',
  );
  assert.deepEqual(
    parsed.nodes.filter((node) => node.type === 'heading').map((node) => node.id),
    ['install', 'install-2'],
  );
  assert.equal(parsed.nodes.find((node) => node.type === 'code').language, 'text');
  assert.equal(parsed.nodes.find((node) => node.type === 'table').rows[0].length, 2);
  assert.equal(parsed.nodes.find((node) => node.type === 'list').items[0][1].type, 'list');
});
