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

export const highlightedSelectExampleCodeBlocks = SELECT_EXAMPLE_CODE_BLOCKS.map((block) => ({
  ...block,
  tokens: highlightShowcaseCode(block.code, block.language),
}));
