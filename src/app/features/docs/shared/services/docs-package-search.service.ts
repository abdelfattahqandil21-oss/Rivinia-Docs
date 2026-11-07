import { InjectionToken, Service, computed, inject, signal } from '@angular/core';

import { PACKAGE_MANIFEST, type PackageManifestEntry } from '../../../packages/package-manifest';
import { PACKAGE_METADATA } from '../../../packages/package-metadata';
import type { DocsPackageGroup } from '../models/docs-group.model';

export interface DocsPackageSearchOptions {
  readonly includeDescriptions: boolean;
}

export const DOCS_PACKAGE_SEARCH_OPTIONS = new InjectionToken<DocsPackageSearchOptions>(
  'DOCS_PACKAGE_SEARCH_OPTIONS',
  { factory: () => ({ includeDescriptions: false }) },
);

@Service({ autoProvided: false })
export class DocsPackageSearchService {
  private readonly options = inject(DOCS_PACKAGE_SEARCH_OPTIONS);

  readonly query = signal('');

  readonly visiblePackages = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    if (!query) return PACKAGE_MANIFEST;
    const matches = (value: string) => value.toLocaleLowerCase().includes(query);
    return PACKAGE_MANIFEST.filter(
      (entry) =>
        matches(entry.id) ||
        matches(entry.name) ||
        (this.options.includeDescriptions && matches(PACKAGE_METADATA[entry.id].description)),
    );
  });

  forGroup(group: DocsPackageGroup): readonly PackageManifestEntry[] {
    return this.visiblePackages().filter((entry) => entry.docs.group === group);
  }
}
