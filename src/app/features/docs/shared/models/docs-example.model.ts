import type { Type } from '@angular/core';
import type { CodeLanguage } from '../../../../shared/utils/code-highlight';
export interface DocsExample {
  readonly id: string;
  readonly meta: {
    readonly title: string;
    readonly scenario: string;
    readonly tryIt: readonly string[];
    readonly mode: 'component' | 'frame';
    readonly minHeight: number;
    readonly variants: readonly ('theme' | 'dir')[];
  };
  readonly files: readonly {
    readonly path: string;
    readonly source: string;
    readonly language: Exclude<CodeLanguage, 'typescript'>;
  }[];
  readonly srcdoc: string;
  readonly load?: () => Promise<Type<unknown>>;
}
