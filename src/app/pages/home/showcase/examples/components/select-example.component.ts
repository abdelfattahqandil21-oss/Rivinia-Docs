import { Component, computed, effect, inject, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { RiviniaSelect } from '@rivinia/select';
import type { RiviniaSelectOption } from '@rivinia/select';
import { RiviniaSelectComponent, type SelectChange } from '@rivinia/select/ui';

import { highlightShowcaseCode } from '../../showcase-code-highlight';
import type { ShowcaseCodeBlock } from '../../showcase-example.model';

export const SELECT_EXAMPLE_CODE_BLOCKS = [
  {
    id: 'single-html',
    titleKey: 'showcase.select.singleTitle',
    language: 'html',
    code: `<rv-select
  mode="single"
  [options]="options()"
  [label]="'Choose capabilities'"
  [searchable]="true"
  [value]="singleValue()"
  (valueChange)="singleValue.set($event)"
/>`,
  },
  {
    id: 'single-typescript',
    titleKey: 'showcase.select.singleState',
    language: 'typescript',
    code: `import { signal } from '@angular/core';
import type { SelectChange } from '@rivinia/select/ui';

readonly singleValue = signal<SelectChange>(null);`,
  },
  {
    id: 'multi-html',
    titleKey: 'showcase.select.multiTitle',
    language: 'html',
    code: `<rv-select
  mode="multi"
  [options]="options()"
  [label]="'Choose capabilities'"
  [searchable]="true"
  [value]="multiValue()"
  (valueChange)="multiValue.set($event)"
/>`,
  },
  {
    id: 'multi-typescript',
    titleKey: 'showcase.select.multiState',
    language: 'typescript',
    code: `import { signal } from '@angular/core';
import type { SelectChange } from '@rivinia/select/ui';

readonly multiValue = signal<SelectChange>([]);`,
  },
  {
    id: 'headless-typescript',
    titleKey: 'showcase.select.headlessTitle',
    language: 'typescript',
    code: `import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('multi');
select.syncOptions(options);
select.setQuery(query);
select.toggle(option.id);
const selectedIds = select.values();`,
  },
  {
    id: 'headless-markup',
    titleKey: 'showcase.select.headlessMarkup',
    language: 'html',
    code: `<label>
  <input type="checkbox"
    [checked]="select.isSelected(option.id)"
    (change)="select.toggle(option.id)" />
  {{ option.label }}
</label>`,
  },
] as const satisfies readonly ShowcaseCodeBlock[];

@Component({
  imports: [RiviniaSelectComponent, RvTranslatePipe],
  selector: 'app-showcase-select-example',
  templateUrl: '../templates/select-example.component.html',
  styleUrl: '../styles/select-example.component.css',
})
export class SelectExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly singleValue = signal<SelectChange>(null);
  protected readonly multiValue = signal<SelectChange>([]);
  protected readonly headlessSelect = new RiviniaSelect('multi');
  protected readonly highlightedCodeBlocks = SELECT_EXAMPLE_CODE_BLOCKS.map((block) => ({
    ...block,
    tokens: highlightShowcaseCode(block.code, block.language),
  }));
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
