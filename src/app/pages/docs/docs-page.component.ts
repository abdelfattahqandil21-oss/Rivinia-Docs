import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { CopyButtonComponent } from '../../shared/components/copy-button/copy-button.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  imports: [RouterLink, CodeBlockComponent, CopyButtonComponent, PageHeaderComponent],
  selector: 'app-docs-page',
  host: { class: 'block' },
  templateUrl: './docs-page.component.html',
})
export class DocsPageComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly title = this.i18n.t('page.docs.title');
  protected readonly lead = this.i18n.t('page.docs.lead');
  protected readonly installCode = 'npm install @rivinia/select';

  protected headingLink(id: string): string {
    const location = this.document.defaultView?.location;
    return location ? `${location.origin}${location.pathname}#${id}` : `/docs#${id}`;
  }
}
