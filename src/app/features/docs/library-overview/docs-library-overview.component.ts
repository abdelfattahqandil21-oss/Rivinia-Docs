import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../../shared/components/code-block/code-block.component';
import { docsLink } from '../shared/docs-link';
import { DocsDependencyListComponent } from './components/docs-dependency-list/docs-dependency-list.component';
import { DocsLibraryHeaderComponent } from './components/docs-library-header/docs-library-header.component';
import { DocsLibraryNotFoundComponent } from './components/docs-library-not-found/docs-library-not-found.component';
import { DocsPackageGuideComponent } from './components/docs-package-guide/docs-package-guide.component';
import { DocsQuickStartComponent } from './components/docs-quick-start/docs-quick-start.component';
import { DocsPackageDetailsService } from './services/docs-package-details.service';
import { DocsQuickStartService } from './services/docs-quick-start.service';

@Component({
  imports: [
    RouterLink,
    CodeBlockComponent,
    DocsLibraryHeaderComponent,
    DocsLibraryNotFoundComponent,
    DocsPackageGuideComponent,
    DocsQuickStartComponent,
    DocsDependencyListComponent,
  ],
  providers: [DocsPackageDetailsService, DocsQuickStartService],
  selector: 'app-docs-library-overview',
  templateUrl: './docs-library-overview.component.html',
  styleUrl: './docs-library-overview.component.css',
})
export class DocsLibraryOverviewComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly details = inject(DocsPackageDetailsService);
  protected readonly quickStart = inject(DocsQuickStartService);

  protected readonly notFoundTitle = this.i18n.t('docs.notFound.title');
  protected readonly notFoundBody = this.i18n.t('docs.notFound.body');
  protected readonly notFoundLink = docsLink();
}
