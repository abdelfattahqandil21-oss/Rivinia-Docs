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
    language: 'ts',
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
    language: 'ts',
    code: `import { signal } from '@angular/core';
import type { SelectChange } from '@rivinia/select/ui';

readonly multiValue = signal<SelectChange>([]);`,
  },
  {
    id: 'headless-single-typescript',
    titleKey: 'showcase.select.headlessSingleTitle',
    language: 'ts',
    code: `import { signal } from '@angular/core';
import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('single');
const open = signal(false);
const activeOptionId = signal<string | null>(null);
select.syncOptions(options);
function choose(id: string): void {
  if (select.select(id)) {
    open.set(false);
    activeOptionId.set(null);
  }
}
const selectedId = select.value();`,
  },
  {
    id: 'headless-single-markup',
    titleKey: 'showcase.select.headlessSingleMarkup',
    language: 'html',
    code: `<div
  role="option"
  [attr.aria-selected]="select.isSelected(option.id)"
  (click)="select.select(option.id)"
>
  {{ option.label }}
</div>`,
  },
  {
    id: 'headless-multi-typescript',
    titleKey: 'showcase.select.headlessMultiTitle',
    language: 'ts',
    code: `import { signal } from '@angular/core';
import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('multi');
const open = signal(false);
const activeOptionId = signal<string | null>(null);
select.syncOptions(options);
const enabledOptions = () => select.filtered().filter((option) => !option.disabled);
function onKeydown(event: KeyboardEvent): void {
  const options = enabledOptions();
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!options.length) return;
    open.set(true);
    const current = options.findIndex(({ id }) => id === activeOptionId());
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const next = current < 0
      ? direction === 1 ? 0 : options.length - 1
      : (current + direction + options.length) % options.length;
    activeOptionId.set(options[next]?.id ?? null);
  } else if (event.key === 'Enter') {
    const id = activeOptionId();
    if (id) select.toggle(id);
  } else if (event.key === 'Escape') {
    open.set(false);
    activeOptionId.set(null);
  }
}
const selectedIds = select.values();`,
  },
  {
    id: 'headless-multi-markup',
    titleKey: 'showcase.select.headlessMultiMarkup',
    language: 'html',
    code: `<div role="listbox" aria-multiselectable="true">
  @for (option of options; track option.id) {
    <div
      role="option"
      [attr.aria-selected]="select.isSelected(option.id)"
      (click)="select.toggle(option.id)"
    >
      <span aria-hidden="true">
        {{ select.isSelected(option.id) ? '✓' : '' }}
      </span>
      {{ option.label }}
    </div>
  }
</div>`,
  },
] as const satisfies readonly ShowcaseCodeBlock[];

export const selectExampleCodeBlocks = SELECT_EXAMPLE_CODE_BLOCKS;
