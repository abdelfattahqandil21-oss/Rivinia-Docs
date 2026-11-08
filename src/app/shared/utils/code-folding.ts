import type { CodeLanguage, CodeToken } from './code-highlight';

export type CodeFoldRegions = ReadonlyMap<number, number>;

const HTML_VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export function findCodeFoldRegions(
  source: string,
  language: CodeLanguage,
  tokens: readonly CodeToken[],
): CodeFoldRegions {
  if (language === 'html') return findHtmlRegions(source, tokens);
  if (
    language === 'ts' ||
    language === 'typescript' ||
    language === 'json' ||
    ['css', 'scss', 'less'].includes(language)
  ) {
    return findBraceRegions(tokens);
  }
  return new Map();
}

function findBraceRegions(tokens: readonly CodeToken[]): CodeFoldRegions {
  const regions = new Map<number, number>();
  const stack: number[] = [];
  let line = 1;

  for (const token of tokens) {
    if (token.kind === 'punctuation') {
      for (const character of token.text) {
        if (character === '{') stack.push(line);
        if (character === '}') {
          const startLine = stack.pop();
          if (startLine !== undefined && line - startLine >= 2) addRegion(regions, startLine, line);
        }
        if (character === '\n') line += 1;
      }
    } else {
      line += countNewlines(token.text);
    }
  }

  return regions;
}

function findHtmlRegions(source: string, tokens: readonly CodeToken[]): CodeFoldRegions {
  const regions = new Map<number, number>();
  const ignoredRanges = getIgnoredRanges(tokens);
  const lineStarts = getLineStarts(source);
  const stack: { readonly name: string; readonly line: number }[] = [];
  let ignoredIndex = 0;
  let cursor = 0;

  while (cursor < source.length) {
    const opening = source.indexOf('<', cursor);
    if (opening < 0) break;

    while (ignoredIndex < ignoredRanges.length && ignoredRanges[ignoredIndex].end <= opening) {
      ignoredIndex += 1;
    }
    const ignored = ignoredRanges[ignoredIndex];
    if (ignored && opening >= ignored.start && opening < ignored.end) {
      cursor = ignored.end;
      continue;
    }

    if (source.startsWith('<!--', opening)) {
      const commentEnd = source.indexOf('-->', opening + 4);
      cursor = commentEnd < 0 ? source.length : commentEnd + 3;
      continue;
    }

    const tag = /^<(\/)?([a-z][\w:-]*)\b/i.exec(source.slice(opening));
    if (!tag) {
      cursor = opening + 1;
      continue;
    }

    const closing = Boolean(tag[1]);
    const name = tag[2].toLowerCase();
    const end = findTagEnd(source, opening + tag[0].length);
    const selfClosing = source
      .slice(opening, end + 1)
      .trimEnd()
      .endsWith('/>');
    const tagLine = lineAt(lineStarts, opening);

    if (closing) {
      let matchingIndex = stack.length - 1;
      while (matchingIndex >= 0 && stack[matchingIndex].name !== name) matchingIndex -= 1;
      if (matchingIndex >= 0) {
        const openingLine = stack[matchingIndex].line;
        stack.splice(matchingIndex);
        if (tagLine - openingLine >= 2) addRegion(regions, openingLine, tagLine);
      }
    } else if (!selfClosing && !HTML_VOID_ELEMENTS.has(name)) {
      stack.push({ name, line: tagLine });
    }

    cursor = Math.max(opening + tag[0].length, end + 1);
  }

  return regions;
}

function getIgnoredRanges(tokens: readonly CodeToken[]): { start: number; end: number }[] {
  const ranges: { start: number; end: number }[] = [];
  let offset = 0;
  for (const token of tokens) {
    const end = offset + token.text.length;
    if ((token.kind === 'string' || token.kind === 'comment') && end > offset) {
      ranges.push({ start: offset, end });
    }
    offset = end;
  }
  return ranges;
}

function getLineStarts(source: string): number[] {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

function lineAt(starts: readonly number[], offset: number): number {
  let low = 0;
  let high = starts.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (starts[middle] <= offset) low = middle + 1;
    else high = middle;
  }
  return low;
}

function findTagEnd(source: string, start: number): number {
  let quote = '';
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = '';
      else if (character === '\\') index += 1;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }
  return source.length - 1;
}

function countNewlines(value: string): number {
  return value.match(/\n/g)?.length ?? 0;
}

function addRegion(regions: Map<number, number>, startLine: number, endLine: number): void {
  regions.set(startLine, Math.max(regions.get(startLine) ?? 0, endLine));
}
