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
    code: `import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('single');
select.syncOptions(options);
select.select(option.id);
const selectedId = select.value();`,
  },
  {
    id: 'headless-single-markup',
    titleKey: 'showcase.select.headlessSingleMarkup',
    language: 'html',
    code: `<label>
  <input type="radio"
    [checked]="select.isSelected(option.id)"
    (change)="select.select(option.id)" />
  {{ option.label }}
</label>`,
  },
  {
    id: 'headless-multi-typescript',
    titleKey: 'showcase.select.headlessMultiTitle',
    language: 'ts',
    code: `import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('multi');
select.syncOptions(options);
select.toggle(option.id);
const selectedIds = select.values();`,
  },
  {
    id: 'headless-multi-markup',
    titleKey: 'showcase.select.headlessMultiMarkup',
    language: 'html',
    code: `<label>
  <input type="checkbox"
    [checked]="select.isSelected(option.id)"
    (change)="select.toggle(option.id)" />
  {{ option.label }}
</label>`,
  },
] as const satisfies readonly ShowcaseCodeBlock[];

export const selectExampleCodeBlocks = SELECT_EXAMPLE_CODE_BLOCKS;
