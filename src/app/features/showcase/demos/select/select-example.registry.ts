import type { ShowcaseCodeBlock } from '../../showcase-example.model';

export const SELECT_EXAMPLE_CODE_BLOCKS = [
  {
    id: 'ui-single-html',
    titleKey: 'showcase.select.singleTitle',
    language: 'html',
    code: `<rv-select
  mode="single"
  [options]="options"
  [label]="'Choose capabilities'"
  [searchable]="true"
  [value]="singleValue()"
  (valueChange)="singleValue.set($event)"
/>`,
  },
  {
    id: 'ui-single-typescript',
    titleKey: 'showcase.select.singleState',
    language: 'ts',
    code: `import { Component, signal } from '@angular/core';
import type { RiviniaSelectOption } from '@rivinia/select';
import type { SelectChange } from '@rivinia/select/ui';
import { RiviniaSelectComponent } from '@rivinia/select/ui';

@Component({
  selector: 'app-single-select-example',
  imports: [RiviniaSelectComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SingleSelectExampleComponent {
  readonly options: readonly RiviniaSelectOption[] = [
    { id: 'signals', label: 'Signal-based state' },
    { id: 'accessible', label: 'Accessible by default' },
  ];
  readonly singleValue = signal<SelectChange>(null);
}`,
  },
  {
    id: 'ui-single-css',
    titleKey: 'showcase.select.singleState',
    language: 'css',
    code: `:host {
  display: block;
}

rv-select {
  display: block;
  min-inline-size: 0;
}`,
  },
  {
    id: 'ui-multi-html',
    titleKey: 'showcase.select.multiTitle',
    language: 'html',
    code: `<rv-select
  mode="multi"
  [options]="options"
  [label]="'Choose capabilities'"
  [searchable]="true"
  [value]="multiValue()"
  (valueChange)="multiValue.set($event)"
/>`,
  },
  {
    id: 'ui-multi-typescript',
    titleKey: 'showcase.select.multiState',
    language: 'ts',
    code: `import { Component, signal } from '@angular/core';
import type { RiviniaSelectOption } from '@rivinia/select';
import type { SelectChange } from '@rivinia/select/ui';
import { RiviniaSelectComponent } from '@rivinia/select/ui';

@Component({
  selector: 'app-multi-select-example',
  imports: [RiviniaSelectComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class MultiSelectExampleComponent {
  readonly options: readonly RiviniaSelectOption[] = [
    { id: 'signals', label: 'Signal-based state' },
    { id: 'accessible', label: 'Accessible by default' },
  ];
  readonly multiValue = signal<SelectChange>([]);
}`,
  },
  {
    id: 'ui-multi-css',
    titleKey: 'showcase.select.multiState',
    language: 'css',
    code: `:host {
  display: block;
}

rv-select {
  display: block;
  min-inline-size: 0;
}`,
  },
  {
    id: 'headless-single-html',
    titleKey: 'showcase.select.headlessSingleMarkup',
    language: 'html',
    code: `<div class="headless-select">
  <button type="button" (click)="toggleOpen()">
    {{ selectedLabel() ?? 'Choose one' }}
  </button>
  <input [value]="query()" (input)="setQuery($event)" />
  <div role="listbox" [hidden]="!open()">
    @for (option of filteredOptions(); track option.id) {
      <div
        role="option"
        [attr.aria-selected]="select.isSelected(option.id)"
        (click)="choose(option.id)"
      >
        {{ option.label }}
      </div>
    }
  </div>
</div>`,
  },
  {
    id: 'headless-single-typescript',
    titleKey: 'showcase.select.headlessSingleTitle',
    language: 'ts',
    code: `import { Component, computed, signal } from '@angular/core';
import { RiviniaSelect } from '@rivinia/select';
import type { RiviniaSelectOption } from '@rivinia/select';

@Component({
  selector: 'app-headless-select-example',
  templateUrl: './headless-select.component.html',
  styleUrl: './headless-select.component.css',
})
export class HeadlessSelectExampleComponent {
  readonly options: readonly RiviniaSelectOption[] = [
    { id: 'signals', label: 'Signal-based state' },
    { id: 'accessible', label: 'Accessible by default' },
  ];
  readonly select = new RiviniaSelect('single');
  readonly open = signal(false);
  readonly query = signal('');
  readonly filteredOptions = computed(() => this.select.filtered());
  readonly selectedLabel = computed(
    () => this.options.find(({ id }) => id === this.select.value())?.label ?? null,
  );

  constructor() {
    this.select.syncOptions(this.options);
  }

  toggleOpen(): void {
    this.open.update((open) => !open);
  }

  setQuery(event: Event): void {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.select.setQuery(value);
    this.query.set(value);
  }

  choose(id: string): void {
    if (this.select.select(id)) this.open.set(false);
  }
}`,
  },
  {
    id: 'headless-single-css',
    titleKey: 'showcase.select.headlessSingleMarkup',
    language: 'css',
    code: `.headless-select {
  position: relative;
  display: grid;
  gap: 0.5rem;
}

[role='listbox'] {
  position: absolute;
  inset-block-start: 100%;
  inset-inline: 0;
  z-index: 1;
  max-block-size: 16rem;
  overflow: auto;
  background: var(--rv-bg);
}`,
  },
  {
    id: 'headless-multi-html',
    titleKey: 'showcase.select.headlessMultiMarkup',
    language: 'html',
    code: `<div class="headless-select">
  <button type="button" (click)="toggleOpen()">
    {{ select.values().length || 'Choose options' }}
  </button>
  <input [value]="query()" (input)="setQuery($event)" />
  <div role="listbox" aria-multiselectable="true" [hidden]="!open()">
    @for (option of filteredOptions(); track option.id) {
      <div
        role="option"
        [attr.aria-selected]="select.isSelected(option.id)"
        (click)="toggle(option.id)"
      >
        {{ option.label }}
      </div>
    }
  </div>
</div>`,
  },
  {
    id: 'headless-multi-typescript',
    titleKey: 'showcase.select.headlessMultiTitle',
    language: 'ts',
    code: `import { Component, computed, signal } from '@angular/core';
import { RiviniaSelect } from '@rivinia/select';
import type { RiviniaSelectOption } from '@rivinia/select';

@Component({
  selector: 'app-headless-multi-select-example',
  templateUrl: './headless-select.component.html',
  styleUrl: './headless-select.component.css',
})
export class HeadlessMultiSelectExampleComponent {
  readonly options: readonly RiviniaSelectOption[] = [
    { id: 'signals', label: 'Signal-based state' },
    { id: 'accessible', label: 'Accessible by default' },
  ];
  readonly select = new RiviniaSelect('multi');
  readonly open = signal(false);
  readonly query = signal('');
  readonly filteredOptions = computed(() => this.select.filtered());

  constructor() {
    this.select.syncOptions(this.options);
  }

  toggleOpen(): void {
    this.open.update((open) => !open);
  }

  setQuery(event: Event): void {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.query.set(value);
    this.select.setQuery(value);
  }

  toggle(id: string): void {
    this.select.toggle(id);
  }
}`,
  },
  {
    id: 'headless-multi-css',
    titleKey: 'showcase.select.headlessMultiMarkup',
    language: 'css',
    code: `.headless-select {
  position: relative;
  display: grid;
  gap: 0.5rem;
}

[role='listbox'] {
  position: absolute;
  inset-block-start: 100%;
  inset-inline: 0;
  z-index: 1;
  max-block-size: 16rem;
  overflow: auto;
  background: var(--rv-bg);
}`,
  },
] as const satisfies readonly ShowcaseCodeBlock[];

export const selectExampleCodeBlocks = SELECT_EXAMPLE_CODE_BLOCKS;
