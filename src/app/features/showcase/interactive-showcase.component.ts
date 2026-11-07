import { DOCUMENT, NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, InjectionToken, signal } from '@angular/core';
import type { Type } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { SHOWCASE_PACKAGES } from '../packages/package-manifest';
import {
  type ShowcaseExampleId,
  type ShowcaseExampleLoaders,
  type ShowcaseExampleModule,
  type ShowcaseExampleSource,
} from './showcase-example.model';

export const SHOWCASE_EXAMPLE_LOADERS = new InjectionToken<ShowcaseExampleLoaders>(
  'SHOWCASE_EXAMPLE_LOADERS',
  {
    factory: () => ({
      select: async () => {
        const [component, source, registry] = await Promise.all([
          import('./demos/select/select-example.component'),
          import('../../../generated/select-example.source.generated'),
          import('./demos/select/select-example.registry'),
        ]);
        return {
          component: component.SelectExampleComponent,
          source: {
            ...source.selectExampleSource,
            codeBlocks: registry.selectExampleCodeBlocks,
          },
        };
      },
      datepicker: async () => {
        const [component, source] = await Promise.all([
          import('./demos/datepicker/datepicker-example.component'),
          import('../../../generated/datepicker-example.source.generated'),
        ]);
        return {
          component: component.DatepickerExampleComponent,
          source: source.datepickerExampleSource,
        };
      },
      table: async () => {
        const [component, source] = await Promise.all([
          import('./demos/table/table-example.component'),
          import('../../../generated/table-example.source.generated'),
        ]);
        return { component: component.TableExampleComponent, source: source.tableExampleSource };
      },
      modal: async () => {
        const [component, source] = await Promise.all([
          import('./demos/modal/modal-example.component'),
          import('../../../generated/modal-example.source.generated'),
        ]);
        return { component: component.ModalExampleComponent, source: source.modalExampleSource };
      },
      toast: async () => {
        const [component, source] = await Promise.all([
          import('./demos/toast/toast-example.component'),
          import('../../../generated/toast-example.source.generated'),
        ]);
        return { component: component.ToastExampleComponent, source: source.toastExampleSource };
      },
    }),
  },
);

const EXAMPLES: readonly { id: ShowcaseExampleId; packageName: string }[] = SHOWCASE_PACKAGES.map(
  ({ id, name }) => ({ id, packageName: name }),
);

@Component({
  imports: [NgComponentOutlet, RouterLink, RvTranslatePipe, CodeBlockComponent],
  selector: 'app-interactive-showcase',
  templateUrl: './interactive-showcase.component.html',
  styleUrl: './interactive-showcase.component.css',
})
export class InteractiveShowcaseComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly document = inject(DOCUMENT);
  private readonly loaders = inject(SHOWCASE_EXAMPLE_LOADERS);

  protected readonly examples = EXAMPLES;
  protected readonly selectedExample = signal<ShowcaseExampleId>('select');
  protected readonly selectedExampleIndex = computed(() =>
    EXAMPLES.findIndex((example) => example.id === this.selectedExample()),
  );
  protected readonly activeView = signal<'preview' | 'code'>('preview');
  protected readonly selectedDemoMode = signal<'headless' | 'ui'>('ui');
  protected readonly selectionMode = signal<'single' | 'multi'>('single');
  protected readonly previewKey = computed(
    () => `${this.selectedExample()}-${this.selectedDemoMode()}-${this.selectionMode()}`,
  );
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly loadedModule = signal<ShowcaseExampleModule | null>(null);
  protected readonly activeComponent = computed<Type<unknown> | null>(
    () => this.loadedModule()?.component ?? null,
  );
  protected readonly activeInputs = computed(() => {
    const inputs = this.loadedModule()?.inputs ?? {};
    return this.selectedExample() === 'select'
      ? {
          ...inputs,
          viewMode: this.selectedDemoMode(),
          selectionMode: this.selectionMode(),
        }
      : inputs;
  });
  protected readonly source = computed<ShowcaseExampleSource | null>(
    () => this.loadedModule()?.source ?? null,
  );
  protected readonly visibleCodeBlocks = computed(() =>
    (this.source()?.codeBlocks ?? []).filter((block) => {
      if (this.selectedExample() !== 'select') {
        return false;
      }
      const mode = this.selectedDemoMode();
      const selection = this.selectionMode();
      return (
        block.id.startsWith(`${mode}-${selection}-`) ||
        (mode === 'ui' && block.id.startsWith(`${selection}-`))
      );
    }),
  );
  protected readonly sourceFiles = computed(() => {
    const source = this.source();
    if (!source || this.selectedExample() === 'select') {
      return [];
    }
    return [
      { id: 'html', name: 'example.component.html', language: 'html' as const, code: source.html },
      {
        id: 'typescript',
        name: 'example.component.ts',
        language: 'ts' as const,
        code: source.typescript,
      },
      ...(source.css
        ? [{ id: 'css', name: 'example.component.css', language: 'css' as const, code: source.css }]
        : []),
    ];
  });

  private readonly modules = new Map<ShowcaseExampleId, ShowcaseExampleModule>();
  private readonly inFlight = new Map<ShowcaseExampleId, Promise<ShowcaseExampleModule>>();
  private requestId = 0;

  constructor() {
    void this.loadExample('select');
  }

  protected selectExample(id: ShowcaseExampleId): void {
    if (this.selectedExample() === id) {
      return;
    }

    this.selectedExample.set(id);
    this.activeView.set('preview');
    void this.loadExample(id);
  }

  protected setView(view: 'preview' | 'code'): void {
    this.activeView.set(view);
  }

  protected setDemoMode(mode: 'headless' | 'ui'): void {
    this.selectedDemoMode.set(mode);
  }

  protected setSelectionMode(mode: 'single' | 'multi'): void {
    this.selectionMode.set(mode);
  }

  protected tabId(id: ShowcaseExampleId): string {
    return `showcase-tab-${id}`;
  }

  protected onTabKeydown(event: KeyboardEvent, id: ShowcaseExampleId): void {
    const tabIndex = EXAMPLES.findIndex((example) => example.id === id);
    const rtl = this.document.documentElement.dir === 'rtl';
    let nextIndex = tabIndex;
    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = EXAMPLES.length - 1;
    } else if (event.key === 'ArrowRight') {
      nextIndex = (tabIndex + (rtl ? -1 : 1) + EXAMPLES.length) % EXAMPLES.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (tabIndex + (rtl ? 1 : -1) + EXAMPLES.length) % EXAMPLES.length;
    } else {
      return;
    }

    event.preventDefault();
    const nextExample = EXAMPLES[nextIndex];
    if (nextExample) {
      this.selectExample(nextExample.id);
      this.document.getElementById(this.tabId(nextExample.id))?.focus();
    }
  }

  protected retry(): void {
    this.modules.delete(this.selectedExample());
    this.inFlight.delete(this.selectedExample());
    void this.loadExample(this.selectedExample());
  }

  protected tabLabel(id: ShowcaseExampleId): string {
    return this.i18n.translate(`showcase.${id}.name`);
  }

  protected async loadExample(id: ShowcaseExampleId): Promise<void> {
    const request = ++this.requestId;
    this.loadedModule.set(this.modules.get(id) ?? null);
    this.loading.set(!this.modules.has(id));
    this.failed.set(false);

    if (this.modules.has(id)) {
      return;
    }

    let pending = this.inFlight.get(id);
    if (!pending) {
      pending = this.loaders[id]();
      this.inFlight.set(id, pending);
    }

    try {
      const loaded = await pending;
      this.modules.set(id, loaded);
      if (request === this.requestId && this.selectedExample() === id) {
        this.loadedModule.set(loaded);
      }
    } catch {
      if (request === this.requestId && this.selectedExample() === id) {
        this.failed.set(true);
      }
    } finally {
      if (this.inFlight.get(id) === pending) {
        this.inFlight.delete(id);
      }
      if (request === this.requestId) {
        this.loading.set(false);
      }
    }
  }
}
