import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { docsLink } from '../../../shared/docs-link';
import type { DocsDependencyRow } from '../../services/docs-package-details.service';

@Component({
  imports: [RouterLink],
  selector: 'section[app-docs-dependency-list]',
  templateUrl: './docs-dependency-list.component.html',
  styleUrl: './docs-dependency-list.component.css',
})
export class DocsDependencyListComponent {
  readonly sectionId = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly rows = input.required<readonly DocsDependencyRow[]>();

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected packageEntryLink(name: string): string {
    return docsLink(name.replace(/^@rivinia\//, ''));
  }
}
