import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { docsHeadingLink } from '../../../shared/docs-link';
import { DocsPageContextService } from '../../services/docs-page-context.service';

@Component({
  selector: 'nav[app-docs-page-rail]',
  templateUrl: './docs-page-rail.component.html',
  styleUrl: './docs-page-rail.component.css',
  host: { '[attr.aria-label]': 'label()' },
})
export class DocsPageRailComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly page = inject(DocsPageContextService);
  protected readonly label = this.i18n.t('docs.onThisPage');

  protected headingLink(id: string): string {
    return docsHeadingLink(this.document, id);
  }
}
