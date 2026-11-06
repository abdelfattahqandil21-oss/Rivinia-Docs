import { Type } from '@angular/core';

export type ShowcaseExampleId = 'select' | 'datepicker' | 'table' | 'modal';

export interface ShowcaseExampleSource {
  readonly html: string;
  readonly typescript: string;
  readonly css?: string;
}

export interface ShowcaseExampleModule {
  readonly component: Type<unknown>;
  readonly source: ShowcaseExampleSource;
}

export type ShowcaseExampleLoader = () => Promise<ShowcaseExampleModule>;

export type ShowcaseExampleLoaders = Readonly<Record<ShowcaseExampleId, ShowcaseExampleLoader>>;
