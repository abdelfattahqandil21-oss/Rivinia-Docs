import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  imports: [RouterLink, PageHeaderComponent],
  selector: 'section[app-docs-library-not-found]',
  templateUrl: './docs-library-not-found.component.html',
  styleUrl: './docs-library-not-found.component.css',
})
export class DocsLibraryNotFoundComponent {
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly link = input.required<string>();
  readonly linkLabel = input.required<string>();
}
