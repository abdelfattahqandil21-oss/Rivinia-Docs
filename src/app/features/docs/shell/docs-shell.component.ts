import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { NavContextService } from '../../../layout/nav-context.service';
import { DocsPackageSearchService } from '../shared/services/docs-package-search.service';
import { DocsMenuDialogComponent } from './components/docs-menu-dialog.component';
import { DocsPageRailComponent } from './components/docs-page-rail.component';
import { DocsSidebarComponent } from './components/docs-sidebar.component';
import { DocsSidebarToggleComponent } from './components/docs-sidebar-toggle.component';
import { DocsPageContextService } from './services/docs-page-context.service';
import { DocsSidebarService } from './services/docs-sidebar.service';

@Component({
  imports: [
    RouterOutlet,
    DocsSidebarComponent,
    DocsSidebarToggleComponent,
    DocsPageRailComponent,
    DocsMenuDialogComponent,
  ],
  providers: [DocsPackageSearchService, DocsPageContextService, DocsSidebarService],
  selector: 'app-docs-shell',
  templateUrl: './docs-shell.component.html',
  styleUrl: './docs-shell.component.css',
})
export class DocsShellComponent {
  private readonly navContext = inject(NavContextService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly sidebar = inject(DocsSidebarService);
  protected readonly page = inject(DocsPageContextService);
  protected readonly expandSidebarLabel = this.i18n.t('docs.expandSidebar');

  constructor() {
    this.navContext.docsRoute.set(true);
    this.destroyRef.onDestroy(() => this.navContext.docsRoute.set(false));
  }
}
