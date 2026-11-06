import { Type } from '@angular/core';
import type { ShowcasePackage } from '../packages/package-manifest';

export type ShowcaseExampleId = ShowcasePackage['id'];

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
  readonly inputs?: Readonly<Record<string, unknown>>;
}

export type ShowcaseExampleLoader = () => Promise<ShowcaseExampleModule>;

export type ShowcaseExampleLoaders = Readonly<Record<ShowcaseExampleId, ShowcaseExampleLoader>>;
