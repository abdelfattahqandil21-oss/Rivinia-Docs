import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CopyButtonComponent } from '../../shared/components/copy-button/copy-button.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PACKAGE_MANIFEST } from '../packages/package-manifest';
import { PACKAGE_METADATA } from '../packages/package-metadata';
import { DocsPackageFilterComponent } from './docs-package-filter.component';
import { docsLink } from './docs-link';

const DOCS_GROUPS = ['foundations', 'components', 'primitives'] as const;
const FIRST_GETTING_STARTED_SLUG = 'choose-the-package-for-your-task';

@Component({
  imports: [RouterLink, PageHeaderComponent, DocsPackageFilterComponent, CopyButtonComponent],
  selector: 'app-docs-hub',
  templateUrl: './docs-hub.component.html',
  styleUrl: './docs-hub.component.css',
})
export class DocsHubComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly title = this.i18n.t('page.docs.title');
  protected readonly lead = this.i18n.t('docs.hub.lead');
  protected readonly groups = DOCS_GROUPS;
  protected readonly filterText = signal('');
  protected readonly visiblePackages = computed(() => {
    const query = this.filterText().trim().toLocaleLowerCase();
    return PACKAGE_MANIFEST.filter(
      (entry) =>
        !query ||
        entry.id.toLocaleLowerCase().includes(query) ||
        entry.name.toLocaleLowerCase().includes(query) ||
        PACKAGE_METADATA[entry.id].description.toLocaleLowerCase().includes(query),
    );
  });
  protected readonly gettingStartedLink = docsLink('getting-started', FIRST_GETTING_STARTED_SLUG);

  protected packagesForGroup(group: (typeof DOCS_GROUPS)[number]) {
    return this.visiblePackages().filter((entry) => entry.docs.group === group);
  }

  protected packageLink(id: string): string {
    return docsLink(id);
  }

  protected headingLink(id: string): string {
    const location = this.document.defaultView?.location;
    return location ? `${location.origin}${location.pathname}#${id}` : `${docsLink()}#${id}`;
  }

  protected metadata(id: (typeof PACKAGE_MANIFEST)[number]['id']) {
    return PACKAGE_METADATA[id];
  }
}
