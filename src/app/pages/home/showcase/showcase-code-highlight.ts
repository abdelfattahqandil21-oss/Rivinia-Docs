export type ShowcaseCodeKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'type'
  | 'number'
  | 'tag'
  | 'attribute'
  | 'binding'
  | 'property'
  | 'selector'
  | 'variable'
  | 'pipe'
  | 'function'
  | 'punctuation';

export interface ShowcaseCodeToken {
  readonly kind: ShowcaseCodeKind;
  readonly text: string;
}

const TOKEN_PATTERN =
  /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|<\/?[a-z][\w-]*|\[\([A-Za-z_][\w.-]*\)\]|\[[A-Za-z_][\w.-]*\]|\([A-Za-z_][\w.-]*\)|\$[A-Za-z_][\w$]*|--[\w-]+|#[\da-fA-F]{3,8}\b|@[A-Za-z-]+|\.[A-Za-z_][\w-]*(?=[\s{,:])|:[A-Za-z-]+|[A-Za-z_-][\w-]*(?=\s*=)|[A-Za-z_$][\w$]*(?=\s*:)|[A-Za-z_$][\w$]*(?=\s*\()|\b(?:import|from|export|const|readonly|return|interface|type|class|protected|private|new|this|if|else|true|false|null|undefined|as|extends)\b|\b(?:string|number|boolean|unknown|void|Signal|Type|Rivinia[A-Za-z]+|SelectChange|TableColumn)\b|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*|[{}()[\].,:;=<>+\-*?\/|]/g;

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
  'SelectChange',
  'TableColumn',
]);

export function highlightShowcaseCode(
  source: string,
  language: 'html' | 'typescript' | 'css',
): readonly ShowcaseCodeToken[] {
  const tokens: ShowcaseCodeToken[] = [];
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
      tokens.push(...highlightShowcaseCode(text.slice(1, -1), 'typescript'));
      tokens.push({ kind: 'punctuation', text: quote });
    } else {
      tokens.push({ kind: classify(text, language, source.slice(index + text.length)), text });
    }
    cursor = index + text.length;
  }

  if (cursor < source.length) tokens.push({ kind: 'plain', text: source.slice(cursor) });
  return tokens;
}

function classify(
  text: string,
  language: 'html' | 'typescript' | 'css',
  followingSource: string,
): ShowcaseCodeKind {
  if (/^(<!--|\/\*|\/\/)/.test(text)) return 'comment';
  if (/^(?:`|'|")/.test(text)) return 'string';
  if (language === 'html' && /^<\/?[A-Za-z]/.test(text)) return 'tag';
  if (language === 'html' && /^(?:\[|\()/.test(text)) return 'binding';
  if (language === 'html' && /^[A-Za-z_-][\w-]*$/.test(text) && /^\s*=/.test(followingSource)) {
    return 'attribute';
  }
  if (text.startsWith('$')) return 'variable';
  if (text === 'rvTranslate') return 'pipe';
  if (
    language === 'html' &&
    /^(?:i18n|options|selected|table|pageSize|pageCount|locale|selectedDate|selectionSummary|open|title|description)$/.test(
      text,
    )
  ) {
    return 'variable';
  }
  if (language === 'css' && /^(--|#|\.|:|@)/.test(text)) {
    if (text.startsWith('--')) return 'variable';
    if (text.startsWith('@')) return 'keyword';
    if (/^#[\da-fA-F]{3,8}$/.test(text)) return 'number';
    return 'selector';
  }
  if (language === 'css' && /^[A-Za-z_-][\w-]*$/.test(text) && /^\s*:/.test(followingSource)) {
    return 'property';
  }
  if (language === 'typescript' && KEYWORDS.has(text)) return 'keyword';
  if (language === 'typescript' && (TYPES.has(text) || /^Rivinia[A-Za-z]+$/.test(text)))
    return 'type';
  if (
    language === 'typescript' &&
    /^[A-Za-z_$][\w$]*$/.test(text) &&
    /^\s*:/.test(followingSource)
  ) {
    return 'property';
  }
  if (/^\d/.test(text)) return 'number';
  if (/^[A-Za-z_$][\w$]*$/.test(text) && /^\s*\(/.test(followingSource)) return 'function';
  if (language === 'typescript' && /^[A-Za-z_$][\w$]*$/.test(text)) return 'variable';
  if (/^[{}()[\].,:;=<>+\-*?\/]$/.test(text)) return 'punctuation';
  return 'plain';
}
