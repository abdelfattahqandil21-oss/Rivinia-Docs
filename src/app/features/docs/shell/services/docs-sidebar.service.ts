import { Service, computed, inject, linkedSignal, signal } from '@angular/core';

import { PACKAGE_METADATA } from '../../../packages/package-metadata';
import type { DocsNavGroup } from '../../shared/models/docs-group.model';
import { DocsPageContextService } from './docs-page-context.service';

@Service({ autoProvided: false })
export class DocsSidebarService {
  private readonly pageContext = inject(DocsPageContextService);

  readonly collapsed = signal(false);
  readonly openGroup = linkedSignal<DocsNavGroup | null>(() => this.pageContext.activeNavGroup());
  readonly packageNavigationId = linkedSignal(() => this.pageContext.activePackageId());
  readonly showingPackageSections = computed(() => {
    const packageId = this.packageNavigationId();
    return packageId ? !!PACKAGE_METADATA[packageId as keyof typeof PACKAGE_METADATA] : false;
  });

  toggleSidebar(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  toggleGroup(group: DocsNavGroup): void {
    this.openGroup.update((current) => (current === group ? null : group));
  }

  backToPackageList(): void {
    this.packageNavigationId.set(null);
  }

  openPackageSections(packageId: string): void {
    this.packageNavigationId.set(packageId);
  }
}
