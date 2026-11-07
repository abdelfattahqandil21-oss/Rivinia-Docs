import { InjectionToken, Service, computed, effect, inject, signal } from '@angular/core';

import {
  SHOWCASE_EXAMPLE_IDS,
  loadShowcaseExampleSource,
} from '../../../showcase/showcase-example.loaders';
import type {
  ShowcaseExampleId,
  ShowcaseExampleSource,
} from '../../../showcase/showcase-example.model';
import { DocsPackageDetailsService } from './docs-package-details.service';

export interface DocsQuickStartFile {
  readonly name: string;
  readonly language: 'html' | 'ts' | 'css';
  readonly code: string;
}

export type DocsQuickStartLoader = (id: ShowcaseExampleId) => Promise<ShowcaseExampleSource>;

export const DOCS_QUICK_START_LOADER = new InjectionToken<DocsQuickStartLoader>(
  'DOCS_QUICK_START_LOADER',
  { factory: () => loadShowcaseExampleSource },
);

@Service({ autoProvided: false })
export class DocsQuickStartService {
  private readonly details = inject(DocsPackageDetailsService);
  private readonly loadSource = inject(DOCS_QUICK_START_LOADER);
  private readonly source = signal<ShowcaseExampleSource | null>(null);

  readonly showLiveExample = computed(() => {
    const entry = this.details.entry();
    return entry?.showcase === true && SHOWCASE_EXAMPLE_IDS.includes(entry.id);
  });

  readonly files = computed<readonly DocsQuickStartFile[]>(() => {
    const source = this.source();
    if (!source) return [];
    if (source.codeBlocks?.length) {
      const chosen =
        this.details.packageId() === 'select'
          ? source.codeBlocks.filter((block) => block.id.startsWith('ui-single-'))
          : source.codeBlocks;
      return chosen.map((block) => ({
        name: this.sourceFilename(block.language),
        language: block.language,
        code: block.code,
      }));
    }
    return [
      { name: 'example.component.html', language: 'html' as const, code: source.html },
      { name: 'example.component.ts', language: 'ts' as const, code: source.typescript },
      ...(source.css
        ? [{ name: 'example.component.css', language: 'css' as const, code: source.css }]
        : []),
    ];
  });

  constructor() {
    effect(() => {
      const entry = this.details.entry();
      this.source.set(null);
      if (!entry?.showcase || !SHOWCASE_EXAMPLE_IDS.includes(entry.id)) return;

      const requestedPackage = entry.id;
      this.loadSource(requestedPackage as ShowcaseExampleId)
        .then((source) => {
          if (this.details.entry()?.id === requestedPackage) this.source.set(source);
        })
        .catch(() => {
          if (this.details.entry()?.id === requestedPackage) this.source.set(null);
        });
    });
  }

  private sourceFilename(language: 'html' | 'ts' | 'css'): string {
    const basename =
      this.details.packageId() === 'select' ? 'select' : `${this.details.packageId()}-example`;
    return `${basename}.component.${language === 'ts' ? 'ts' : language}`;
  }
}
