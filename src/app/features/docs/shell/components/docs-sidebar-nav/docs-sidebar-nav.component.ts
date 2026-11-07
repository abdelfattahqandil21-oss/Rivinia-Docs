import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { GETTING_STARTED_PAGES } from '../../../getting-started/models/docs-getting-started.model';
import { docsLink } from '../../../shared/docs-link';
import { DOCS_PACKAGE_GROUPS } from '../../../shared/models/docs-group.model';
import { DocsPackageSearchService } from '../../../shared/services/docs-package-search.service';
import { DocsSidebarService } from '../../services/docs-sidebar.service';

@Component({
  imports: [RouterLink, RouterLinkActive, IconComponent],
  selector: 'nav[app-docs-sidebar-nav]',
  templateUrl: './docs-sidebar-nav.component.html',
  styleUrl: './docs-sidebar-nav.component.css',
  host: { '[attr.aria-label]': 'navigationLabel()' },
})
export class DocsSidebarNavComponent {
  readonly panelPrefix = input.required<string>();

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly search = inject(DocsPackageSearchService);
  protected readonly sidebar = inject(DocsSidebarService);
  protected readonly groups = DOCS_PACKAGE_GROUPS;
  protected readonly gettingStartedPages = GETTING_STARTED_PAGES;
  protected readonly navigationLabel = this.i18n.t('docs.navigation');

  protected packageLink(id: string): string {
    return docsLink(id);
  }

  protected gettingStartedLink(slug: string): string {
    return docsLink('getting-started', slug);
  }
}
