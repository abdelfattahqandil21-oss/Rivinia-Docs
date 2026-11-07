import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../../shared/components/code-block/code-block.component';
import { CopyButtonComponent } from '../../../shared/components/copy-button/copy-button.component';
import { docsHeadingLink, docsLink } from '../shared/docs-link';
import { GETTING_STARTED_PAGES } from './models/docs-getting-started.model';

@Component({
  imports: [RouterLink, CodeBlockComponent, CopyButtonComponent],
  selector: 'app-docs-getting-started',
  templateUrl: './docs-getting-started.component.html',
  styleUrl: './docs-getting-started.component.css',
})
export class DocsGettingStartedComponent {
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly pages = GETTING_STARTED_PAGES;
  protected readonly pageIndex = Number(this.route.snapshot.data['docsStep']);
  protected readonly page = this.pages[this.pageIndex] ?? this.pages[0];
  protected readonly installCode = 'npm install @rivinia/select';
  protected readonly previousLink =
    this.pageIndex > 0 ? docsLink('getting-started', this.pages[this.pageIndex - 1].slug) : null;
  protected readonly nextLink =
    this.pageIndex < this.pages.length - 1
      ? docsLink('getting-started', this.pages[this.pageIndex + 1].slug)
      : null;

  protected headingLink(id: string): string {
    return docsHeadingLink(this.document, id);
  }
}
