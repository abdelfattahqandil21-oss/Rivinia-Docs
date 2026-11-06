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
  protected readonly singleValue = signal<SelectChange>(null);
  protected readonly multiValue = signal<SelectChange>([]);
  protected readonly headlessSelect = new RiviniaSelect('multi');
  protected readonly highlightedCodeBlocks = input<
    readonly { readonly tokens: readonly { readonly kind: string; readonly text: string }[] }[]
  >([]);
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
  protected readonly singleSummary = computed(() => this.labelsFor(this.singleValue()));
  protected readonly multiSummary = computed(() => this.labelsFor(this.multiValue()));
  protected readonly headlessSummary = computed(() =>
    this.headlessSelect.selectedLabels().join('، '),
  );

  constructor() {
    effect(() => this.headlessSelect.syncOptions(this.options()));
  }

  protected setSingleValue(value: SelectChange): void {
    this.singleValue.set(typeof value === 'string' ? value : null);
  }

  protected setMultiValue(value: SelectChange): void {
    this.multiValue.set(Array.isArray(value) ? value : value ? [value] : []);
  }

  private labelsFor(value: SelectChange): string {
    const ids = Array.isArray(value) ? value : value ? [value] : [];
    return this.options()
      .filter((option) => ids.includes(option.id))
      .map((option) => option.label)
      .join('، ');
  }
}
