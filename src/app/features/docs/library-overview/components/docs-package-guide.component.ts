import { Component, inject, input } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import type { DocsPackageGuide } from '../models/docs-package-guides.model';

@Component({
  selector: 'section[app-docs-package-guide]',
  templateUrl: './docs-package-guide.component.html',
  styleUrl: './docs-package-guide.component.css',
})
export class DocsPackageGuideComponent {
  readonly guide = input.required<DocsPackageGuide>();

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
}
