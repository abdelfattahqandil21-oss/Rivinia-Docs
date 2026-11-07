import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DocsPackageFilterComponent } from '../package-filter/docs-package-filter.component';
import { docsLink } from '../shared/docs-link';
import { DOCS_PACKAGE_GROUPS, type DocsPackageGroup } from '../shared/models/docs-group.model';
import {
  DOCS_PACKAGE_SEARCH_OPTIONS,
  DocsPackageSearchService,
} from '../shared/services/docs-package-search.service';
import { DocsHubPackageGroupComponent } from './components/docs-hub-package-group/docs-hub-package-group.component';

const FIRST_GETTING_STARTED_SLUG = 'choose-the-package-for-your-task';

@Component({
  imports: [
    RouterLink,
    PageHeaderComponent,
    DocsPackageFilterComponent,
    DocsHubPackageGroupComponent,
  ],
  providers: [
    DocsPackageSearchService,
    { provide: DOCS_PACKAGE_SEARCH_OPTIONS, useValue: { includeDescriptions: true } },
  ],
  selector: 'app-docs-hub',
  templateUrl: './docs-hub.component.html',
  styleUrl: './docs-hub.component.css',
})
export class DocsHubComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly search = inject(DocsPackageSearchService);
  protected readonly title = this.i18n.t('page.docs.title');
  protected readonly lead = this.i18n.t('docs.hub.lead');
  protected readonly groups = DOCS_PACKAGE_GROUPS;
  protected readonly gettingStartedLink = docsLink('getting-started', FIRST_GETTING_STARTED_SLUG);

  protected packagesForGroup(group: DocsPackageGroup) {
    return this.search.forGroup(group);
  }

  protected packageLink(id: string): string {
    return docsLink(id);
  }
}
