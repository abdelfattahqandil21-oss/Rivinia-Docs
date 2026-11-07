import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  imports: [RouterLink, CodeBlockComponent, PageHeaderComponent],
  selector: 'app-docs-page',
  host: { class: 'block' },
  templateUrl: './docs-page.component.html',
})
export class DocsPageComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly title = this.i18n.t('page.docs.title');
  protected readonly lead = this.i18n.t('page.docs.lead');
  protected readonly installCode = 'npm install @rivinia/select';
}
