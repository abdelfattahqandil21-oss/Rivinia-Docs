import { describe, expect, it } from 'vitest';

import { highlightCode } from './code-highlight';

describe('highlightCode', () => {
  it('preserves HTML while marking tags, attributes, and strings', () => {
    const source = '<rv-select aria-label="Choose" />';
    const tokens = highlightCode(source, 'html');

    expect(tokens.map((token) => token.text).join('')).toBe(source);
    expect(tokens).toContainEqual({ kind: 'tag', text: '<rv-select' });
    expect(tokens).toContainEqual({ kind: 'attribute', text: 'aria-label' });
    expect(tokens).toContainEqual({ kind: 'string', text: '"Choose"' });
  });

  it('highlights Angular bindings and expressions inside bound attribute values', () => {
    const source = '<rv-select [options]="options()" (valueChange)="selected.set($event)" />';
    const tokens = highlightCode(source, 'html');

    expect(tokens.map((token) => token.text).join('')).toBe(source);
    expect(tokens).toContainEqual({ kind: 'binding', text: '[options]' });
    expect(tokens).toContainEqual({ kind: 'function', text: 'options' });
    expect(tokens).toContainEqual({ kind: 'binding', text: '(valueChange)' });
    expect(tokens).toContainEqual({ kind: 'variable', text: 'selected' });
    expect(tokens).toContainEqual({ kind: 'variable', text: '$event' });
  });

  it('marks TypeScript comments, keywords, types, strings, and numbers', () => {
    const tokens = highlightCode(
      '// example\nconst selected = signal<RiviniaDate | null>({ month: 11 });',
      'typescript',
    );

    expect(tokens.some((token) => token.kind === 'comment')).toBe(true);
    expect(tokens.some((token) => token.kind === 'keyword' && token.text === 'const')).toBe(true);
    expect(tokens.some((token) => token.kind === 'type' && token.text === 'RiviniaDate')).toBe(
      true,
    );
    expect(tokens.some((token) => token.kind === 'string')).toBe(false);
    expect(tokens.some((token) => token.kind === 'number' && token.text === '11')).toBe(true);
  });

  it('marks CSS selectors, properties, variables, and values', () => {
    const tokens = highlightCode('.demo { color: var(--rv-accent); }', 'css');

    expect(tokens.some((token) => token.kind === 'selector' && token.text === '.demo')).toBe(true);
    expect(tokens.some((token) => token.kind === 'property' && token.text === 'color')).toBe(true);
    expect(tokens.some((token) => token.kind === 'function' && token.text === 'var')).toBe(true);
    expect(tokens.some((token) => token.kind === 'variable' && token.text === '--rv-accent')).toBe(
      true,
    );
  });

  it('highlights bash commands, flags, and variables without changing source text', () => {
    const source = 'npm install @rivinia/select --save\necho $HOME';
    const tokens = highlightCode(source, 'bash');

    expect(tokens.map((token) => token.text).join('')).toBe(source);
    expect(tokens).toContainEqual({ kind: 'command', text: 'npm' });
    expect(tokens).toContainEqual({ kind: 'property', text: '--save' });
    expect(tokens).toContainEqual({ kind: 'command', text: 'echo' });
    expect(tokens).toContainEqual({ kind: 'variable', text: '$HOME' });
  });
});
