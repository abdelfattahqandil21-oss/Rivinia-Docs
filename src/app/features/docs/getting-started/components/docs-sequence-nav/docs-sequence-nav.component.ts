import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

export interface DocsSequenceStep {
  readonly href: string;
  readonly titleKey: string;
}

@Component({
  imports: [RouterLink],
  selector: 'nav[app-docs-sequence-nav]',
  templateUrl: './docs-sequence-nav.component.html',
  styleUrl: './docs-sequence-nav.component.css',
  host: { '[attr.aria-label]': 'label()' },
})
export class DocsSequenceNavComponent {
  readonly previous = input<DocsSequenceStep | null>(null);
  readonly next = input<DocsSequenceStep | null>(null);

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly label = this.i18n.t('docs.gettingStarted');
}
