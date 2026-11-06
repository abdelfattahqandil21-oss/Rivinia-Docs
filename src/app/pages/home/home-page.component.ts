import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  imports: [RouterLink, PageHeaderComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected readonly eyebrow = this.i18n.t('page.home.eyebrow');
  protected readonly title = this.i18n.t('page.home.title');
  protected readonly lead = this.i18n.t('page.home.lead');
  protected readonly primaryCta = this.i18n.t('page.home.primaryCta');
  protected readonly secondaryCta = this.i18n.t('page.home.secondaryCta');
}
