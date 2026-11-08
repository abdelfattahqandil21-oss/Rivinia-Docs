import { marked } from 'marked';
marked.use({
  extensions: [
    {
      name: 'directive',
      level: 'block',
      start(source) {
        return source.indexOf(':::');
      },
      tokenizer(source) {
        const match = /^:::(example ([a-z0-9-]+)|tokens|entrypoints) *(?:\n|$)/.exec(source);
        return match
          ? {
              type: 'directive',
              raw: match[0],
              kind: match[1].startsWith('example') ? 'example' : match[1],
              name: match[2],
            }
          : undefined;
      },
    },
  ],
});

export function slug(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function parseMarkdown(source, file, rewrite = (href) => ({ href, external: false })) {
  const stripped = [];
  const ids = new Map();
  const fail = (token) => {
    const offset = source.indexOf(token.raw);
    throw new Error(
      `${file}:${source.slice(0, Math.max(0, offset)).split('\n').length}: unsupported ${token.type}`,
    );
  };
  function inline(tokens = []) {
    return tokens.flatMap((token) => {
      switch (token.type) {
        case 'text':
        case 'escape':
          return token.tokens ? inline(token.tokens) : [{ type: 'text', text: token.text }];
        case 'codespan':
          return [{ type: 'code', text: token.text }];
        case 'strong':
        case 'em':
        case 'del':
          return [{ type: token.type, children: inline(token.tokens) }];
        case 'br':
          return [{ type: 'br' }];
        case 'link':
          return [{ type: 'link', ...rewrite(token.href), children: inline(token.tokens) }];
        case 'image':
          return fail(token);
        default:
          return fail(token);
      }
    });
  }
  function blocks(tokens) {
    return tokens.flatMap((token) => {
      switch (token.type) {
        case 'space':
          return [];
        case 'heading': {
          const base = slug(token.text) || 'section';
          const count = ids.get(base) ?? 0;
          ids.set(base, count + 1);
          return [
            {
              type: 'heading',
              level: token.depth,
              id: count ? `${base}-${count + 1}` : base,
              children: inline(token.tokens),
            },
          ];
        }
        case 'directive':
          return [{ type: token.kind, name: token.name }];
        case 'paragraph':
        case 'text':
          return [
            {
              type: 'paragraph',
              children: inline(token.tokens ?? [{ type: 'text', text: token.text }]),
            },
          ];
        case 'code':
          return [
            { type: 'code', code: token.text, language: token.lang?.split(/\s/)[0] || 'text' },
          ];
        case 'list':
          return [
            {
              type: 'list',
              ordered: token.ordered,
              start: token.start || 1,
              items: token.items.map((item) => blocks(item.tokens)),
            },
          ];
        case 'blockquote':
          return [{ type: 'blockquote', children: blocks(token.tokens) }];
        case 'hr':
          return [{ type: 'hr' }];
        case 'table':
          return [
            {
              type: 'table',
              align: token.align,
              header: token.header.map((cell) => inline(cell.tokens)),
              rows: token.rows.map((row) => row.map((cell) => inline(cell.tokens))),
            },
          ];
        case 'html':
          return fail(token);
        default:
          return fail(token);
      }
    });
  }
  if (
    source
      .split('\n')
      .some(
        (line) =>
          line.startsWith(':::') && !/^:::(?:example [a-z0-9-]+|tokens|entrypoints)\s*$/.test(line),
      )
  )
    throw new Error(`${file}: unknown directive`);
  return { nodes: blocks(marked.lexer(source)), stripped };
}
