import { Component, inject } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  imports: [PageHeaderComponent],
  selector: 'app-docs-page',
  templateUrl: './docs-page.component.html',
  styleUrl: './docs-page.component.css',
})
export class DocsPageComponent {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected readonly title = this.i18n.t('page.docs.title');
  protected readonly lead = this.i18n.t('page.docs.lead');
  protected readonly inProgress = this.i18n.t('page.inProgress');
}
