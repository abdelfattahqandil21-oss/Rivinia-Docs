import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frontmatter } from './content.mjs';
import { parseMarkdown } from './markdown.mjs';

test('authored frontmatter requires evidence and rejects unknown fields', () => {
  assert.throws(
    () =>
      frontmatter(
        '---\n{"title":"Sample","summary":"Text","order":1,"sources":[]}\n---\n',
        'page.md',
      ),
    /nonempty sources/,
  );
  assert.equal(
    frontmatter(
      '---\ntitle: Sample\nsummary: Text\norder: 1\nsources:\n  - node_modules/@rivinia/theme/README.md\n---\nBody',
      'page.md',
    ).meta.sources.length,
    1,
  );
});
test('AST preserves plain fences, directives, nesting and unique headings', () => {
  const { nodes } = parseMarkdown(
    '## One\n\n## One\n\n:::tokens\n\n```\noutput\n```\n\n- Item\n  - Nested\n',
    'page.md',
  );
  assert.deepEqual(
    nodes.filter((node) => node.type === 'heading').map((node) => node.id),
    ['one', 'one-2'],
  );
  assert.equal(nodes.find((node) => node.type === 'code').language, 'text');
  assert.ok(nodes.some((node) => node.type === 'tokens'));
});
test('author HTML and unknown directives are rejected', () => {
  assert.throws(() => parseMarkdown('<script>alert(1)</script>', 'page.md'), /unsupported html/);
  assert.throws(() => parseMarkdown(':::unknown', 'page.md'), /unknown directive/);
});

test('installed exports reject the known RvTable documentation typo', async () => {
  const { auditImports, tokenRows } = await import('./reference.mjs');
  const root = new URL('../../', import.meta.url).pathname;
  await assert.rejects(
    auditImports("import { RvTable } from '@rivinia/table/ui';", root, 'example.md'),
    /RvTable is not exported/,
  );
  await auditImports(
    "import { RiviniaTableComponent } from '@rivinia/table/ui';",
    root,
    'example.md',
  );
  const tokens = await tokenRows(root);
  assert.equal(tokens.length, 12);
  assert.equal(tokens.find((token) => token.name === '--rv-bg').dark, '#161616');
});
