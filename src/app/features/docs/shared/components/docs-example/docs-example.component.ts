import { Component, computed, inject, input, signal } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';
import { DOCS_EXAMPLES, THEME_PREVIEW_TOKENS } from '../../docs-examples';
import { DocsExamplePreviewComponent } from '../docs-example-preview/docs-example-preview.component';
import { CodeBlockComponent } from '../../../../../shared/components/code-block/code-block.component';
@Component({
  selector: 'app-docs-example',
  imports: [DocsExamplePreviewComponent, CodeBlockComponent],
  templateUrl: './docs-example.component.html',
  styleUrl: './docs-example.component.css',
})
export class DocsExampleComponent {
  readonly name = input.required<string>();
  readonly package = input.required<string>();
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly example = computed(() =>
    DOCS_EXAMPLES.find((entry) => entry.id === `${this.package()}/${this.name()}`),
  );
  protected readonly view = signal('preview');
  protected readonly theme = signal<'light' | 'dark'>('light');
  protected readonly direction = signal<'ltr' | 'rtl'>('ltr');
  protected readonly file = signal(0);
  protected readonly revision = signal(0);
  protected readonly styles = computed(
    () =>
      `color-scheme:${this.theme()};${THEME_PREVIEW_TOKENS.map((token) => `${token.name}:${token[this.theme()]}`).join(';')}`,
  );
  protected reset(): void {
    this.theme.set('light');
    this.direction.set('ltr');
    this.file.set(0);
    this.revision.update((value) => value + 1);
  }
}
