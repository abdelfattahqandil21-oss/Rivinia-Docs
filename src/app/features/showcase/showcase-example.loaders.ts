import { InjectionToken } from '@angular/core';

import { SHOWCASE_PACKAGES } from '../packages/package-manifest';
import type {
  ShowcaseExampleId,
  ShowcaseExampleLoaders,
  ShowcaseExampleSource,
} from './showcase-example.model';

export const SHOWCASE_EXAMPLE_LOADERS = new InjectionToken<ShowcaseExampleLoaders>(
  'SHOWCASE_EXAMPLE_LOADERS',
  {
    factory: () => ({
      select: async () => {
        const [component, source] = await Promise.all([
          import('./demos/select/select-example.component'),
          loadShowcaseExampleSource('select'),
        ]);
        return { component: component.SelectExampleComponent, source };
      },
      datepicker: async () => {
        const [component, source, examples] = await Promise.all([
          import('./demos/datepicker/datepicker-example.component'),
          loadShowcaseExampleSource('datepicker'),
          import('./demos/datepicker/datepicker-code-groups'),
        ]);
        return {
          component: component.DatepickerExampleComponent,
          source: { ...source, codeGroups: examples.DATEPICKER_CODE_GROUPS },
        };
      },
      table: async () => {
        const [component, source] = await Promise.all([
          import('./demos/table/table-example.component'),
          loadShowcaseExampleSource('table'),
        ]);
        return { component: component.TableExampleComponent, source };
      },
      modal: async () => {
        const [component, source] = await Promise.all([
          import('./demos/modal/modal-example.component'),
          loadShowcaseExampleSource('modal'),
        ]);
        return { component: component.ModalExampleComponent, source };
      },
      toast: async () => {
        const [component, source] = await Promise.all([
          import('./demos/toast/toast-example.component'),
          loadShowcaseExampleSource('toast'),
        ]);
        return { component: component.ToastExampleComponent, source };
      },
    }),
  },
);

export async function loadShowcaseExampleSource(
  id: ShowcaseExampleId,
): Promise<ShowcaseExampleSource> {
  switch (id) {
    case 'select': {
      const [source, registry] = await Promise.all([
        import('../../../generated/select-example.source.generated'),
        import('./demos/select/select-example.registry'),
      ]);
      return { ...source.selectExampleSource, codeBlocks: registry.selectExampleCodeBlocks };
    }
    case 'datepicker':
      return (await import('../../../generated/datepicker-example.source.generated'))
        .datepickerExampleSource;
    case 'table':
      return (await import('../../../generated/table-example.source.generated')).tableExampleSource;
    case 'modal':
      return (await import('../../../generated/modal-example.source.generated')).modalExampleSource;
    case 'toast':
      return (await import('../../../generated/toast-example.source.generated')).toastExampleSource;
  }
}

export const SHOWCASE_EXAMPLE_IDS: readonly ShowcaseExampleId[] = SHOWCASE_PACKAGES.map(
  ({ id }) => id,
);
