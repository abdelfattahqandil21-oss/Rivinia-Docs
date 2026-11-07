import { Component, computed, inject, input, model } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

@Component({
  selector: 'app-docs-package-filter',
  template: `
    <label class="filter-label" [attr.for]="inputId()">
      {{ i18n.translate('docs.filter.label') }}
    </label>
    <input
      class="package-filter"
      type="search"
      [id]="inputId()"
      [value]="value()"
      [attr.aria-describedby]="inputId() + '-count'"
      [attr.placeholder]="i18n.translate('docs.filter.placeholder')"
      (input)="onInput($event)"
      (keydown.escape)="clear()"
    />
    <p class="filter-count" [id]="inputId() + '-count'" aria-live="polite" aria-atomic="true">
      {{ resultsAnnouncement() }}
    </p>
    @if (resultCount() === 0) {
      <p class="empty-filter" role="status">{{ i18n.translate('docs.filter.empty') }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .filter-label {
      display: block;
      margin-block-end: 0.5rem;
      color: var(--rv-fg);
      font-size: 0.875rem;
      font-weight: 600;
    }
    .package-filter {
      inline-size: 100%;
      min-block-size: 2.75rem;
      border: 1px solid var(--rv-border);
      border-radius: var(--home-radius-sm);
      background: var(--rv-home-surface-raised);
      color: var(--rv-fg);
      padding-inline: 0.75rem;
    }
    .package-filter:focus-visible {
      outline: 2px solid var(--rv-accent);
      outline-offset: 3px;
    }
    .filter-count,
    .empty-filter {
      margin-block: 0.5rem 0;
      color: var(--rv-muted);
      font-size: 0.8rem;
    }
  `,
})
export class DocsPackageFilterComponent {
  readonly inputId = input.required<string>();
  readonly resultCount = input.required<number>();
  readonly value = model('');

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly resultsAnnouncement = computed(() =>
    this.i18n.translate('docs.filter.count', { count: this.resultCount() }),
  );

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.value.set('');
  }
}
