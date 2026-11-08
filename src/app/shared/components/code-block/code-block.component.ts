import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { CopyButtonComponent } from '../copy-button/copy-button.component';
import { highlightCode } from '../../utils/code-highlight';
import { findCodeFoldRegions } from '../../utils/code-folding';
import type { CodeLanguage, CodeToken } from '../../utils/code-highlight';

interface CodeLine {
  readonly number: number;
  readonly tokens: readonly CodeToken[];
}

interface VisibleCodeLine extends CodeLine {
  readonly foldable: boolean;
  readonly folded: boolean;
}

@Component({
  imports: [CopyButtonComponent],
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input.required<Exclude<CodeLanguage, 'typescript'>>();
  readonly filename = input<string | null>(null);
  readonly caption = input<string | null>(null);
  readonly scrollable = input(false);
  protected readonly foldedRegionLines = signal<ReadonlySet<number>>(new Set());

  protected readonly tokens = computed(() => highlightCode(this.code(), this.language()));
  protected readonly lines = computed(() => splitCodeLines(this.tokens()));
  protected readonly foldRegions = computed(() =>
    findCodeFoldRegions(this.code(), this.language(), this.tokens()),
  );
  protected readonly showLineNumbers = computed(
    () => this.language() !== 'text' && this.lines().length > 1,
  );
  protected readonly visibleLines = computed(() => {
    const hiddenLines = new Set<number>();
    const regions = this.foldRegions();
    for (const startLine of this.foldedRegionLines()) {
      const endLine = regions.get(startLine);
      if (endLine === undefined) continue;
      for (let line = startLine + 1; line <= endLine; line += 1) hiddenLines.add(line);
    }
    return this.lines()
      .filter((line) => !hiddenLines.has(line.number))
      .map((line): VisibleCodeLine => ({
        ...line,
        foldable: regions.has(line.number),
        folded: this.foldedRegionLines().has(line.number),
      }));
  });
  protected readonly hasFoldRegions = computed(() => this.foldRegions().size > 0);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly languageName = computed(() => {
    const language = this.language();
    if (language === 'ts') return 'TypeScript';
    if (language === 'json') return 'JSON';
    if (language === 'text') return '';
    return language.toUpperCase();
  });

  constructor() {
    effect(() => {
      this.code();
      this.foldedRegionLines.set(new Set());
    });
  }

  protected isRegionFolded(lineNumber: number): boolean {
    return this.foldedRegionLines().has(lineNumber);
  }

  protected regionLabel(lineNumber: number): string {
    return this.i18n.translate(
      this.isRegionFolded(lineNumber) ? 'common.expandCodeRegion' : 'common.foldCodeRegion',
      { line: lineNumber },
    );
  }

  protected hiddenLineCount(lineNumber: number): number {
    return (this.foldRegions().get(lineNumber) ?? lineNumber) - lineNumber;
  }

  protected toggleRegion(lineNumber: number): void {
    this.foldedRegionLines.update((current) => {
      const next = new Set(current);
      if (next.has(lineNumber)) next.delete(lineNumber);
      else next.add(lineNumber);
      return next;
    });
  }
}

function splitCodeLines(tokens: ReturnType<typeof highlightCode>): readonly CodeLine[] {
  const lines: CodeToken[][] = [[]];

  for (const token of tokens) {
    let cursor = 0;
    while (cursor < token.text.length) {
      const newline = token.text.indexOf('\n', cursor);
      const end = newline < 0 ? token.text.length : newline;
      const text = token.text.slice(cursor, end).replace(/\r$/, '');
      if (text) lines[lines.length - 1].push({ kind: token.kind, text });
      if (newline < 0) break;
      lines.push([]);
      cursor = newline + 1;
    }
  }

  const source = tokens.map((token) => token.text).join('');
  if (source.endsWith('\n') && lines.length > 1) lines.pop();

  return lines.map((line, index) => ({ number: index + 1, tokens: line }));
}
