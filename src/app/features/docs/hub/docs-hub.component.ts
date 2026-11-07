import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CopyButtonComponent } from '../../../shared/components/copy-button/copy-button.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { type PackageManifestEntry } from '../../packages/package-manifest';
import { PACKAGE_METADATA } from '../../packages/package-metadata';
import { DocsPackageFilterComponent } from '../package-filter/docs-package-filter.component';
import { docsHeadingLink, docsLink } from '../shared/docs-link';
import { DOCS_PACKAGE_GROUPS, type DocsPackageGroup } from '../shared/models/docs-group.model';
import {
  DOCS_PACKAGE_SEARCH_OPTIONS,
  DocsPackageSearchService,
} from '../shared/services/docs-package-search.service';

const FIRST_GETTING_STARTED_SLUG = 'choose-the-package-for-your-task';

@Component({
  imports: [RouterLink, PageHeaderComponent, DocsPackageFilterComponent, CopyButtonComponent],
  providers: [
    DocsPackageSearchService,
    { provide: DOCS_PACKAGE_SEARCH_OPTIONS, useValue: { includeDescriptions: true } },
  ],
  selector: 'app-docs-hub',
  templateUrl: './docs-hub.component.html',
  styleUrl: './docs-hub.component.css',
})
export class DocsHubComponent {
  private readonly document = inject(DOCUMENT);
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

  protected headingLink(id: string): string {
    return docsHeadingLink(this.document, id);
  }

  protected metadata(id: PackageManifestEntry['id']) {
    return PACKAGE_METADATA[id];
  }
}
