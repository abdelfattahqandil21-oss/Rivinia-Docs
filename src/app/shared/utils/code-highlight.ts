export type CodeLanguage =
  'ts' | 'typescript' | 'html' | 'css' | 'scss' | 'less' | 'sh' | 'bash' | 'json' | 'text';

export type CodeTokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'type'
  | 'number'
  | 'tag'
  | 'attribute'
  | 'binding'
  | 'event'
  | 'property'
  | 'selector'
  | 'variable'
  | 'pipe'
  | 'function'
  | 'command'
  | 'punctuation';

export interface CodeToken {
  readonly kind: CodeTokenKind;
  readonly text: string;
}

const TOKEN_PATTERN =
  /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|<\/?[a-z][\w-]*|\[\([A-Za-z_][\w.-]*\)\]|\[[A-Za-z_][\w.-]*\]|\([A-Za-z_][\w.-]*\)|\$[A-Za-z_][\w$]*|--[\w-]+|#[\da-fA-F]{3,8}\b|@[A-Za-z-]+|\.[A-Za-z_][\w-]*(?=[\s{,:])|:[A-Za-z-]+|[A-Za-z_-][\w-]*(?=\s*=)|[A-Za-z_$][\w$]*(?=\s*:)|[A-Za-z_$][\w$]*(?=\s*\()|\b(?:import|from|export|const|readonly|return|interface|type|class|protected|private|new|this|if|else|true|false|null|undefined|as|extends)\b|\b(?:string|number|boolean|unknown|void|Signal|Type|Component|Rivinia[A-Za-z]+|SelectChange|TableColumn)\b|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*|[{}()[\].,:;=<>+\-*?\/|]/g;

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'const',
  'readonly',
  'return',
  'interface',
  'type',
  'class',
  'protected',
  'private',
  'new',
  'this',
  'if',
  'else',
  'true',
  'false',
  'null',
  'undefined',
  'as',
  'extends',
]);
const TYPES = new Set([
  'string',
  'number',
  'boolean',
  'unknown',
  'void',
  'Signal',
  'Type',
  'Component',
  'SelectChange',
  'TableColumn',
]);

export function highlightCode(source: string, language: CodeLanguage): readonly CodeToken[] {
  if (language === 'text') return [{ kind: 'plain', text: source }];

  const tokens: CodeToken[] = [];
  let cursor = 0;
  TOKEN_PATTERN.lastIndex = 0;

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const text = match[0];
    const index = match.index;
    if (index > cursor) tokens.push({ kind: 'plain', text: source.slice(cursor, index) });
    const prefix = source.slice(0, index);
    if (
      language === 'html' &&
      /^(?:".*"|'.*')$/.test(text) &&
      /(?:\[[\w.-]+\]|\([\w.-]+\))\s*=\s*$/.test(prefix)
    ) {
      const quote = text[0];
      tokens.push({ kind: 'punctuation', text: quote });
      tokens.push(...highlightCode(text.slice(1, -1), 'ts'));
      tokens.push({ kind: 'punctuation', text: quote });
    } else {
      tokens.push({
        kind: classify(text, language, source.slice(0, index), source.slice(index + text.length)),
        text,
      });
    }
    cursor = index + text.length;
  }

  if (cursor < source.length) tokens.push({ kind: 'plain', text: source.slice(cursor) });
  return tokens;
}

function classify(
  text: string,
  language: CodeLanguage,
  precedingSource: string,
  followingSource: string,
): CodeTokenKind {
  if (/^(<!--|\/\*|\/\/)/.test(text)) return 'comment';
  if (/^(?:`|'|")/.test(text)) return 'string';
  if (/^@[A-Z]/.test(text)) return 'type';
  if (language === 'html' && /^<\/?[A-Za-z]/.test(text)) return 'tag';
  if (language === 'html' && /^\([A-Za-z_][\w.-]*\)$/.test(text)) return 'event';
  if (language === 'html' && /^\[[A-Za-z_][\w.-]*\]$/.test(text)) return 'property';
  if (language === 'html' && /^\[\([A-Za-z_][\w.-]*\)\]$/.test(text)) return 'binding';
  if (language === 'html' && /^[A-Za-z_-][\w-]*$/.test(text) && /^\s*=/.test(followingSource)) {
    return 'attribute';
  }
  if (text.startsWith('$')) return 'variable';
  if (
    ['bash', 'sh'].includes(language) &&
    /^(?:npm|npx|node|git|ng|pnpm|yarn|cd|mkdir|cat|echo|grep|rg|clear)$/.test(text) &&
    /(?:^|\n)\s*$/.test(precedingSource)
  ) {
    return 'command';
  }
  if (['bash', 'sh'].includes(language) && text.startsWith('--')) return 'property';
  if (text === 'rvTranslate') return 'pipe';
  if (
    language === 'html' &&
    /^(?:i18n|options|selected|table|pageSize|pageCount|locale|selectedDate|selectionSummary|open|title|description)$/.test(
      text,
    )
  ) {
    return 'variable';
  }
  if (['css', 'scss', 'less'].includes(language) && /^(--|#|\.|:|@)/.test(text)) {
    if (text.startsWith('--')) return 'variable';
    if (text.startsWith('@')) return 'keyword';
    if (/^#[\da-fA-F]{3,8}$/.test(text)) return 'number';
    return 'selector';
  }
  if (
    ['css', 'scss', 'less'].includes(language) &&
    /^[A-Za-z_-][\w-]*$/.test(text) &&
    /^\s*:/.test(followingSource)
  ) {
    return 'property';
  }
  if ((language === 'typescript' || language === 'ts') && KEYWORDS.has(text)) return 'keyword';
  if (
    (language === 'typescript' || language === 'ts') &&
    (TYPES.has(text) ||
      /^Rivinia[A-Za-z]+$/.test(text) ||
      /^[A-Z][A-Za-z0-9]*(?:Component|Service|Directive)$/.test(text))
  )
    return 'type';
  if (
    (language === 'typescript' || language === 'ts') &&
    /^[A-Za-z_$][\w$]*$/.test(text) &&
    /^\s*:/.test(followingSource)
  ) {
    return 'property';
  }
  if (/^\d/.test(text)) return 'number';
  if (/^[A-Za-z_$][\w$]*$/.test(text) && /^\s*\(/.test(followingSource)) return 'function';
  if ((language === 'typescript' || language === 'ts') && /^[A-Za-z_$][\w$]*$/.test(text))
    return 'variable';
  if (/^[{}()[\].,:;=<>+\-*?\/]$/.test(text)) return 'punctuation';
  return 'plain';
}
