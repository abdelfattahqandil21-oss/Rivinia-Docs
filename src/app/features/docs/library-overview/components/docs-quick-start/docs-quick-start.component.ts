import { Component, inject, input } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../../../../shared/components/code-block/code-block.component';
import type { DocsQuickStartFile } from '../../services/docs-quick-start.service';

@Component({
  imports: [CodeBlockComponent],
  selector: 'section[app-docs-quick-start]',
  templateUrl: './docs-quick-start.component.html',
  styleUrl: './docs-quick-start.component.css',
})
export class DocsQuickStartComponent {
  readonly files = input.required<readonly DocsQuickStartFile[]>();

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
}
