import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PACKAGE_METADATA } from '../packages/package-metadata';
import { PACKAGE_MANIFEST } from '../packages/package-manifest';
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
  protected readonly packageId = this.route.snapshot.paramMap.get('package') ?? '';
  protected readonly entry = PACKAGE_MANIFEST.find(({ id }) => id === this.packageId) ?? null;
  protected readonly metadata = this.entry ? PACKAGE_METADATA[this.entry.id] : null;
  protected readonly notFoundTitle = this.i18n.t('docs.notFound.title');
  protected readonly notFoundBody = this.i18n.t('docs.notFound.body');
  protected readonly notFoundLink = docsLink();
  protected readonly installCommand = this.metadata ? `npm i ${this.metadata.name}` : '';
  protected readonly published = computed(
    () =>
      this.entry !== null &&
      this.metadata !== null &&
      VERIFIED_PUBLISHED_VERSIONS[this.entry.id] === this.metadata.version,
  );
  protected readonly showLiveExample = computed(
    () => this.entry?.showcase === true && SHOWCASE_EXAMPLE_IDS.includes(this.entry.id),
  );
  protected readonly quickStartSource = signal<ShowcaseExampleSource | null>(null);
  protected readonly quickStartFiles = computed(() => {
    const source = this.quickStartSource();
    if (!source) return [];
    if (source.codeBlocks?.length) {
      const chosen =
        this.packageId === 'select'
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
    this.dependencyRows(this.metadata?.dependencies),
  );
  protected readonly peerDependencies = computed(() =>
    this.dependencyRows(this.metadata?.peerDependencies),
  );
  protected readonly packageTitle = this.entry?.id ?? '';
  protected readonly versionLabel = computed(() => {
    const version = this.metadata?.version ?? '';
    return version.startsWith('0.') ? this.i18n.translate('docs.preOne') : version;
  });

  constructor() {
    if (this.showLiveExample() && this.entry) {
      loadShowcaseExampleSource(this.entry.id as ShowcaseExampleId)
        .then((source) => this.quickStartSource.set(source))
        .catch(() => this.quickStartSource.set(null));
    }
  }

  protected docsLink(id: string): string {
    return docsLink(id);
  }

  protected packageEntryLink(name: string): string {
    return docsLink(name.replace(/^@rivinia\//, ''));
  }

  protected dependencyRows(dependencies: Readonly<Record<string, string>> | undefined) {
    return Object.entries(dependencies ?? {});
  }

  private sourceFilename(language: 'html' | 'ts' | 'css'): string {
    const basename = this.packageId === 'select' ? 'select' : `${this.packageId}-example`;
    return `${basename}.component.${language === 'ts' ? 'ts' : language}`;
  }
}
