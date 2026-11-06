import { Component, inject } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  imports: [PageHeaderComponent],
  selector: 'app-playground-page',
  templateUrl: './playground-page.component.html',
  styleUrl: './playground-page.component.css',
})
export class PlaygroundPageComponent {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected readonly title = this.i18n.t('page.playground.title');
  protected readonly lead = this.i18n.t('page.playground.lead');
  protected readonly inProgress = this.i18n.t('page.inProgress');
}
