import { Component, computed, inject, signal } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';
import type { RiviniaSelectOption } from '@rivinia/select';
import { RiviniaSelectComponent, type SelectChange } from '@rivinia/select/ui';

@Component({
  imports: [RiviniaSelectComponent],
  selector: 'app-showcase-select-example',
  templateUrl: './select-example.component.html',
  styleUrl: './select-example.component.css',
})
export class SelectExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly selected = signal<SelectChange>(null);
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
  protected readonly selectionSummary = computed(() => {
    const value = this.selected();
    const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
    return this.options()
      .filter((option) => selectedIds.includes(option.id))
      .map((option) => option.label)
      .join('، ');
  });
}
