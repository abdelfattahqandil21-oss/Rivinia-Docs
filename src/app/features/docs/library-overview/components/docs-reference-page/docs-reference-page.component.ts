import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { CodeBlockComponent } from '../../../../../shared/components/code-block/code-block.component';
import { DocsSequenceNavComponent } from '../../../getting-started/components/docs-sequence-nav/docs-sequence-nav.component';
import { docsLink } from '../../../shared/docs-link';
import type { DocsReferencePage } from '../../models/docs-reference-pages.model';

@Component({
  selector: 'app-docs-reference-page',
  imports: [RouterLink, CodeBlockComponent, DocsSequenceNavComponent],
  templateUrl: './docs-reference-page.component.html',
  styleUrl: './docs-reference-page.component.css',
})
export class DocsReferencePageComponent {
  readonly packageId = input.required<string>();
  readonly pages = input.required<readonly DocsReferencePage[]>();
  readonly section = input('');
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly index = computed(() =>
    this.pages().findIndex((page) => page.section === this.section()),
  );
  protected readonly page = computed(() => this.pages()[this.index()]);
  protected readonly guides = computed(() =>
    this.pages().filter((page) => page.section.startsWith('guides/')),
  );
  protected readonly previous = computed(() => this.step(this.index() - 1));
  protected readonly next = computed(() => this.step(this.index() + 1));
  protected link(section: string): string {
    return docsLink(this.packageId(), ...section.split('/'));
  }
  private step(index: number) {
    const page = this.pages()[index];
    return page ? { href: this.link(page.section), titleKey: page.titleKey } : null;
  }
}
