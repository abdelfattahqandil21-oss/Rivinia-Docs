import { Type } from '@angular/core';

export type ShowcaseExampleId = 'select' | 'datepicker' | 'table' | 'modal' | 'toast';

export interface ShowcaseExampleSource {
  readonly html: string;
  readonly typescript: string;
  readonly css?: string;
  readonly codeBlocks?: readonly ShowcaseCodeBlock[];
}

export interface ShowcaseCodeBlock {
  readonly id: string;
  readonly titleKey: string;
  readonly language: 'html' | 'typescript';
  readonly code: string;
}

export interface ShowcaseExampleModule {
  readonly component: Type<unknown>;
  readonly source: ShowcaseExampleSource;
}

export type ShowcaseExampleLoader = () => Promise<ShowcaseExampleModule>;

export type ShowcaseExampleLoaders = Readonly<Record<ShowcaseExampleId, ShowcaseExampleLoader>>;
