import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PACKAGE_METADATA } from '../packages/package-metadata';
import { PACKAGE_MANIFEST } from '../packages/package-manifest';
import { DOCS_PACKAGE_GUIDES } from './docs-package-guides.model';
import {
  SHOWCASE_EXAMPLE_IDS,
  loadShowcaseExampleSource,
} from '../showcase/showcase-example.loaders';
import type { ShowcaseExampleId, ShowcaseExampleSource } from '../showcase/showcase-example.model';
import { docsLink } from './docs-link';

const VERIFIED_PUBLISHED_VERSIONS = {
  env: '1.0.3',
  http: '1.0.3',
  i18n: '1.0.3',
  select: '1.0.3',
  theme: '1.0.3',
  datepicker: '1.0.3',
  table: '1.0.3',
  modal: '1.0.3',
  toast: '1.0.3',
  menu: '1.0.3',
  popup: '1.0.3',
} as const;

type QuickStartFile = { name: string; language: 'html' | 'ts' | 'css'; code: string };

@Component({
  imports: [RouterLink, CodeBlockComponent, PageHeaderComponent],
  selector: 'app-docs-library-overview',
  templateUrl: './docs-library-overview.component.html',
  styleUrl: './docs-library-overview.component.css',
})
export class DocsLibraryOverviewComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly packageId = computed(() => this.routeParams().get('package') ?? '');
  protected readonly entry = computed(
    () => PACKAGE_MANIFEST.find(({ id }) => id === this.packageId()) ?? null,
  );
  protected readonly metadata = computed(() => {
    const entry = this.entry();
    return entry ? PACKAGE_METADATA[entry.id] : null;
  });
  protected readonly guide = computed(() => {
    const entry = this.entry();
    return entry ? DOCS_PACKAGE_GUIDES[entry.id] : null;
  });
  protected readonly notFoundTitle = this.i18n.t('docs.notFound.title');
  protected readonly notFoundBody = this.i18n.t('docs.notFound.body');
  protected readonly notFoundLink = docsLink();
  protected readonly installCommand = computed(() => {
    const metadata = this.metadata();
    return metadata ? `npm i ${metadata.name}` : '';
  });
  protected readonly published = computed(() => {
    const entry = this.entry();
    const metadata = this.metadata();
    return (
      entry !== null &&
      metadata !== null &&
      VERIFIED_PUBLISHED_VERSIONS[entry.id] === metadata.version
    );
  });
  protected readonly showLiveExample = computed(() => {
    const entry = this.entry();
    return entry?.showcase === true && SHOWCASE_EXAMPLE_IDS.includes(entry.id);
  });
  protected readonly quickStartSource = signal<ShowcaseExampleSource | null>(null);
  protected readonly quickStartFiles = computed(() => {
    const source = this.quickStartSource();
    if (!source) return [];
    if (source.codeBlocks?.length) {
      const chosen =
        this.packageId() === 'select'
          ? source.codeBlocks.filter((block) => block.id.startsWith('ui-single-'))
          : source.codeBlocks;
      return chosen.map((block) => ({
        name: this.sourceFilename(block.language),
        language: block.language,
        code: block.code,
      }));
    }
    return [
      { name: 'example.component.html', language: 'html' as const, code: source.html },
      { name: 'example.component.ts', language: 'ts' as const, code: source.typescript },
      ...(source.css
        ? [{ name: 'example.component.css', language: 'css' as const, code: source.css }]
        : []),
    ];
  });
  protected readonly dependencies = computed(() =>
    this.dependencyRows(this.metadata()?.dependencies),
  );
  protected readonly peerDependencies = computed(() =>
    this.dependencyRows(this.metadata()?.peerDependencies),
  );
  protected readonly packageTitle = computed(() => this.entry()?.id ?? '');
  protected readonly versionLabel = computed(() => {
    const version = this.metadata()?.version ?? '';
    return version.startsWith('0.') ? this.i18n.translate('docs.preOne') : version;
  });

  constructor() {
    effect(() => {
      const entry = this.entry();
      this.quickStartSource.set(null);
      if (!entry?.showcase || !SHOWCASE_EXAMPLE_IDS.includes(entry.id)) return;

      const requestedPackage = entry.id;
      loadShowcaseExampleSource(requestedPackage as ShowcaseExampleId)
        .then((source) => {
          if (this.entry()?.id === requestedPackage) this.quickStartSource.set(source);
        })
        .catch(() => {
          if (this.entry()?.id === requestedPackage) this.quickStartSource.set(null);
        });
    });
  }

  protected docsLink(id: string): string {
    return docsLink(id);
  }

  protected packageEntryLink(name: string): string {
    return docsLink(name.replace(/^@rivinia\//, ''));
  }

  protected dependencyRows(dependencies: Readonly<Record<string, string>> | undefined) {
    return Object.entries(dependencies ?? {}).map(([name, range]) => {
      const dependencyId = name.replace(/^@rivinia\//, '');
      const installedVersion =
        PACKAGE_METADATA[dependencyId as keyof typeof PACKAGE_METADATA]?.version;
      return { name, range, installedVersion };
    });
  }

  private sourceFilename(language: 'html' | 'ts' | 'css'): string {
    const packageId = this.packageId();
    const basename = packageId === 'select' ? 'select' : `${packageId}-example`;
    return `${basename}.component.${language === 'ts' ? 'ts' : language}`;
  }
}
