import { Service, inject, linkedSignal, signal } from '@angular/core';

import type { DocsNavGroup } from '../../shared/models/docs-group.model';
import { DocsPageContextService } from './docs-page-context.service';

@Service({ autoProvided: false })
export class DocsSidebarService {
  private readonly pageContext = inject(DocsPageContextService);

  readonly collapsed = signal(false);
  readonly openGroup = linkedSignal<DocsNavGroup | null>(() => this.pageContext.activeNavGroup());

  toggleSidebar(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  toggleGroup(group: DocsNavGroup): void {
    this.openGroup.update((current) => (current === group ? null : group));
  }
}
