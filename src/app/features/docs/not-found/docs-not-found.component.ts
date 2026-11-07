import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { docsLink } from '../shared/docs-link';

@Component({
  imports: [PageHeaderComponent, RouterLink],
  selector: 'app-docs-not-found',
  template: `
    <section class="docs-not-found" aria-labelledby="docs-page-title">
      <app-page-header
        id="docs-page-title"
        [attr.tabindex]="-1"
        [title]="i18n.translate('docs.notFound.title')"
        [lead]="i18n.translate('docs.notFound.body')"
      />
      <a [routerLink]="homeLink">{{ i18n.translate('docs.notFound.back') }}</a>
    </section>
  `,
  styles: `
    .docs-not-found {
      width: 100%;
      padding: 3rem 1.5rem;
    }
    .docs-not-found a {
      display: inline-flex;
      min-height: 2.75rem;
      align-items: center;
      color: var(--rv-accent);
      text-underline-offset: 0.2em;
    }
    .docs-not-found a:focus-visible {
      outline: 2px solid var(--rv-accent);
      outline-offset: 3px;
    }
  `,
})
export class DocsNotFoundComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly homeLink = docsLink();
}
