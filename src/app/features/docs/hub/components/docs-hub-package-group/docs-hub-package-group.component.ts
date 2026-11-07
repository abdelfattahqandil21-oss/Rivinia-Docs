import { DOCUMENT } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CopyButtonComponent } from '../../../../../shared/components/copy-button/copy-button.component';
import { type PackageManifestEntry } from '../../../../packages/package-manifest';
import { PACKAGE_METADATA } from '../../../../packages/package-metadata';
import { docsHeadingLink, docsLink } from '../../../shared/docs-link';
import type { DocsPackageGroup } from '../../../shared/models/docs-group.model';

@Component({
  imports: [RouterLink, CopyButtonComponent],
  selector: 'section[app-docs-hub-package-group]',
  templateUrl: './docs-hub-package-group.component.html',
  styleUrl: './docs-hub-package-group.component.css',
})
export class DocsHubPackageGroupComponent {
  readonly group = input.required<DocsPackageGroup>();
  readonly packages = input.required<readonly PackageManifestEntry[]>();

  private readonly document = inject(DOCUMENT);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected packageLink(id: string): string {
    return docsLink(id);
  }

  protected headingLink(id: string): string {
    return docsHeadingLink(this.document, id);
  }

  protected metadata(id: PackageManifestEntry['id']) {
    return PACKAGE_METADATA[id];
  }
}
