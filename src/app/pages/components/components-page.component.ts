import { Component, inject } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ComponentPackagesService } from './services/component-packages.service';

@Component({
  imports: [PageHeaderComponent],
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrl: './components-page.component.css',
})
export class ComponentsPageComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly componentPackages = inject(ComponentPackagesService);

  protected readonly packages = this.componentPackages.packages;

  protected readonly title = this.i18n.t('page.components.title');
  protected readonly lead = this.i18n.t('page.components.lead');
  protected readonly inProgress = this.i18n.t('page.inProgress');
}
