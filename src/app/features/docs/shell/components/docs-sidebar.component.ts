import { Component, inject } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { DocsPackageFilterComponent } from '../../package-filter/docs-package-filter.component';
import { DocsPackageSearchService } from '../../shared/services/docs-package-search.service';
import { DocsSidebarService } from '../services/docs-sidebar.service';
import { DocsSidebarNavComponent } from './docs-sidebar-nav.component';
import { DocsSidebarToggleComponent } from './docs-sidebar-toggle.component';

@Component({
  imports: [DocsPackageFilterComponent, DocsSidebarNavComponent, DocsSidebarToggleComponent],
  selector: 'aside[app-docs-sidebar]',
  templateUrl: './docs-sidebar.component.html',
  styleUrl: './docs-sidebar.component.css',
  host: { '[attr.aria-label]': 'navigationLabel()' },
})
export class DocsSidebarComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly search = inject(DocsPackageSearchService);
  protected readonly sidebar = inject(DocsSidebarService);
  protected readonly navigationLabel = this.i18n.t('docs.navigation');
  protected readonly collapseSidebarLabel = this.i18n.t('docs.collapseSidebar');
}
