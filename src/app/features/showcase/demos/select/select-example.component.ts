import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { RiviniaSelect } from '@rivinia/select';
import type { RiviniaSelectOption } from '@rivinia/select';
import { RiviniaSelectComponent, type SelectChange } from '@rivinia/select/ui';

@Component({
  imports: [RiviniaSelectComponent, RvTranslatePipe],
  selector: 'app-showcase-select-example',
  templateUrl: './select-example.component.html',
  styleUrl: './select-example.component.css',
})
export class SelectExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly document = inject(DOCUMENT);
  readonly viewMode = input<'headless' | 'ui'>('ui');
  readonly selectionMode = input<'single' | 'multi'>('single');
  protected readonly singleValue = signal<SelectChange>(null);
  protected readonly multiValue = signal<SelectChange>([]);
  protected readonly headlessOpen = signal(false);
  protected readonly headlessSelect = computed(() => new RiviniaSelect(this.selectionMode()));
  protected readonly options = computed<readonly RiviniaSelectOption[]>(() => {
    this.i18n.currentLanguage();
    return [
      { id: 'accessibility', label: this.i18n.translate('showcase.select.accessibility') },
      { id: 'customization', label: this.i18n.translate('showcase.select.customization') },
      {
        id: 'coming-soon',
        label: this.i18n.translate('showcase.select.disabled'),
        disabled: true,
      },
    ];
  });
  protected readonly filteredOptions = computed(() => this.headlessSelect().filtered());
  protected readonly singleSummary = computed(() => this.labelsFor(this.singleValue()));
  protected readonly multiSummary = computed(() => this.labelsFor(this.multiValue()));
  protected readonly headlessSummary = computed(() =>
    this.headlessSelect().selectedLabels().join('، '),
  );

  constructor() {
    effect(() => this.headlessSelect().syncOptions(this.options()));
  }

  protected setSingleValue(value: SelectChange): void {
    this.singleValue.set(typeof value === 'string' ? value : null);
  }

  protected setMultiValue(value: SelectChange): void {
    this.multiValue.set(Array.isArray(value) ? value : value ? [value] : []);
  }

  protected setUiValue(value: SelectChange): void {
    if (this.selectionMode() === 'single') {
      this.setSingleValue(value);
    } else {
      this.setMultiValue(value);
    }
  }

  protected toggleHeadless(): void {
    this.headlessOpen.update((open) => !open);
  }

  protected setHeadlessQuery(event: Event): void {
    const input = event.currentTarget;
    if (input instanceof HTMLInputElement) {
      this.headlessSelect().setQuery(input.value);
    }
  }

  protected selectHeadlessOption(id: string, event: Event): void {
    if (this.selectionMode() === 'single') {
      this.headlessSelect().select(id);
      this.headlessOpen.set(false);
      const input = event.currentTarget;
      const trigger =
        input instanceof HTMLInputElement
          ? input.closest('.headless-select')?.querySelector<HTMLButtonElement>('.headless-trigger')
          : null;
      this.document.defaultView?.requestAnimationFrame(() => trigger?.focus());
    } else {
      this.headlessSelect().toggle(id);
    }
  }

  protected closeHeadlessDropdown(event: Event): void {
    this.headlessOpen.set(false);
    const panel = event.currentTarget;
    if (panel instanceof HTMLElement) {
      const trigger = panel
        .closest('.headless-select')
        ?.querySelector<HTMLButtonElement>('.headless-trigger');
      this.document.defaultView?.requestAnimationFrame(() => trigger?.focus());
    }
  }

  private labelsFor(value: SelectChange): string {
    const ids = Array.isArray(value) ? value : value ? [value] : [];
    return this.options()
      .filter((option) => ids.includes(option.id))
      .map((option) => option.label)
      .join('، ');
  }
}
