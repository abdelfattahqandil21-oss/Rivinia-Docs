import { DOCUMENT, NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, InjectionToken, signal } from '@angular/core';
import type { Type } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';

import { IconComponent } from '../../../shared/components/icon/icon.component';
import { highlightShowcaseCode } from '../../../features/showcase/showcase-code-highlight';
import {
  type ShowcaseExampleId,
  type ShowcaseCodeBlock,
  type ShowcaseExampleLoaders,
  type ShowcaseExampleModule,
  type ShowcaseExampleSource,
} from '../../../features/showcase/showcase-example.model';

export const SHOWCASE_EXAMPLE_LOADERS = new InjectionToken<ShowcaseExampleLoaders>(
  'SHOWCASE_EXAMPLE_LOADERS',
  {
    factory: () => ({
      select: async () => {
        const [component, source, registry] = await Promise.all([
          import('../../../features/showcase/demos/select/select-example.component'),
          import('./examples/generated/select-example.source.generated'),
          import('../../../features/showcase/demos/select/select-example.registry'),
        ]);
        return {
          component: component.SelectExampleComponent,
          inputs: { highlightedCodeBlocks: registry.highlightedSelectExampleCodeBlocks },
          source: {
            ...source.selectExampleSource,
            codeBlocks: registry.highlightedSelectExampleCodeBlocks,
          },
        };
      },
      datepicker: async () => {
        const [component, source] = await Promise.all([
          import('../../../features/showcase/demos/datepicker/datepicker-example.component'),
          import('./examples/generated/datepicker-example.source.generated'),
        ]);
        return {
          component: component.DatepickerExampleComponent,
          source: source.datepickerExampleSource,
        };
      },
      table: async () => {
        const [component, source] = await Promise.all([
          import('../../../features/showcase/demos/table/table-example.component'),
          import('./examples/generated/table-example.source.generated'),
        ]);
        return { component: component.TableExampleComponent, source: source.tableExampleSource };
      },
      modal: async () => {
        const [component, source] = await Promise.all([
          import('../../../features/showcase/demos/modal/modal-example.component'),
          import('./examples/generated/modal-example.source.generated'),
        ]);
        return { component: component.ModalExampleComponent, source: source.modalExampleSource };
      },
      toast: async () => {
        const [component, source] = await Promise.all([
          import('../../../features/showcase/demos/toast/toast-example.component'),
          import('./examples/generated/toast-example.source.generated'),
        ]);
        return { component: component.ToastExampleComponent, source: source.toastExampleSource };
      },
    }),
  },
);

const EXAMPLES: readonly { id: ShowcaseExampleId; packageName: string }[] = [
  { id: 'select', packageName: '@rivinia/select' },
  { id: 'datepicker', packageName: '@rivinia/datepicker' },
  { id: 'table', packageName: '@rivinia/table' },
  { id: 'modal', packageName: '@rivinia/modal' },
  { id: 'toast', packageName: '@rivinia/toast' },
];

@Component({
  imports: [IconComponent, NgComponentOutlet, RouterLink, RvTranslatePipe],
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
  protected readonly activeCode = signal<'html' | 'typescript' | 'css'>('html');
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly copied = signal(false);
  protected readonly copiedSnippetId = signal<string | null>(null);
  protected readonly copyFailed = signal(false);
  protected readonly loadedModule = signal<ShowcaseExampleModule | null>(null);
  protected readonly activeComponent = computed<Type<unknown> | null>(
    () => this.loadedModule()?.component ?? null,
  );
  protected readonly activeInputs = computed(() => this.loadedModule()?.inputs ?? {});
  protected readonly source = computed<ShowcaseExampleSource | null>(
    () => this.loadedModule()?.source ?? null,
  );
  protected readonly currentSource = computed(() => {
    const source = this.source();
    const code = this.activeCode();
    return code === 'css' ? (source?.css ?? '') : (source?.[code] ?? '');
  });
  protected readonly highlightedSource = computed(() =>
    highlightShowcaseCode(this.currentSource(), this.activeCode()),
  );
  protected readonly highlightedCodeBlocks = computed(() =>
    (this.source()?.codeBlocks ?? []).map((block) => ({
      ...block,
      tokens: highlightShowcaseCode(block.code, block.language),
    })),
  );
  protected readonly hasCss = computed(() => Boolean(this.source()?.css));

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
    this.activeCode.set('html');
    this.copied.set(false);
    this.copyFailed.set(false);
    void this.loadExample(id);
  }

  protected setView(view: 'preview' | 'code'): void {
    this.activeView.set(view);
  }

  protected setCode(code: 'html' | 'typescript' | 'css'): void {
    this.activeCode.set(code);
    this.copied.set(false);
    this.copyFailed.set(false);
  }

  protected async copySnippet(block: ShowcaseCodeBlock): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) {
      this.copyFailed.set(true);
      return;
    }

    try {
      await clipboard.writeText(block.code);
      this.copiedSnippetId.set(block.id);
      this.copyFailed.set(false);
    } catch {
      this.copyFailed.set(true);
    }
  }

  protected retry(): void {
    this.modules.delete(this.selectedExample());
    this.inFlight.delete(this.selectedExample());
    void this.loadExample(this.selectedExample());
  }

  protected async copyCode(): Promise<void> {
    const view = this.document.defaultView;
    if (!view?.navigator.clipboard || !this.currentSource()) {
      this.copyFailed.set(true);
      return;
    }

    try {
      await view.navigator.clipboard.writeText(this.currentSource());
      this.copied.set(true);
      this.copyFailed.set(false);
    } catch {
      this.copyFailed.set(true);
      this.copied.set(false);
    }
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
