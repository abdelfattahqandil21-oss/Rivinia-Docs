import { describe, expect, it } from 'vitest';

import { findCodeFoldRegions } from './code-folding';
import { highlightCode } from './code-highlight';
import type { CodeLanguage } from './code-highlight';

function regions(source: string, language: CodeLanguage): readonly [number, number][] {
  return [...findCodeFoldRegions(source, language, highlightCode(source, language))];
}

describe('findCodeFoldRegions', () => {
  it('finds nested HTML elements and ignores tags inside attribute strings', () => {
    const source = [
      '<div data-copy="<fake>">',
      '  <section>',
      '    <p>Content</p>',
      '  </section>',
      '</div>',
    ].join('\n');

    expect(regions(source, 'html')).toEqual([
      [2, 4],
      [1, 5],
    ]);
  });

  it('finds brace-delimited TypeScript regions without matching braces in strings', () => {
    const source = [
      'const sample = "{ not a block }";',
      'function load() {',
      '  const values = [1, 2];',
      '  return values;',
      '}',
    ].join('\n');

    expect(regions(source, 'ts')).toEqual([[2, 5]]);
  });

  it('does not expose folding for terminal output', () => {
    expect(regions('npm install @rivinia/i18n\nng serve', 'bash')).toEqual([]);
  });
});
