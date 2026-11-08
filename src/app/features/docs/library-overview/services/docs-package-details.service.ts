import { Service, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { PACKAGE_MANIFEST } from '../../../packages/package-manifest';
import { PACKAGE_METADATA } from '../../../packages/package-metadata';
import { I18N_DOC_PAGES, THEME_DOC_PAGES } from '../models/docs-reference-pages.model';
import { DOCS_PACKAGE_GUIDES } from '../models/docs-package-guides.model';
import { VERIFIED_PUBLISHED_VERSIONS } from '../models/docs-published-versions.model';

export interface DocsDependencyRow {
  readonly name: string;
  readonly range: string;
  readonly installedVersion: string | undefined;
}

@Service({ autoProvided: false })
export class DocsPackageDetailsService {
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  readonly packageId = computed(
    () =>
      this.routeParams().get('package') ??
      (this.routeData()['docsPackageId'] as string | undefined) ??
      '',
  );
  readonly section = computed(
    () =>
      this.routeParams().get('section') ??
      (this.routeData()['section'] as string | undefined) ??
      '',
  );
  readonly entry = computed(
    () => PACKAGE_MANIFEST.find(({ id }) => id === this.packageId()) ?? null,
  );
  readonly metadata = computed(() => {
    const entry = this.entry();
    return entry ? PACKAGE_METADATA[entry.id] : null;
  });
  readonly guide = computed(() => {
    const entry = this.entry();
    return entry ? DOCS_PACKAGE_GUIDES[entry.id] : null;
  });
  readonly installCommand = computed(() => {
    const metadata = this.metadata();
    return metadata ? `npm i ${metadata.name}` : '';
  });
  readonly published = computed(() => {
    const entry = this.entry();
    const metadata = this.metadata();
    return (
      entry !== null &&
      metadata !== null &&
      VERIFIED_PUBLISHED_VERSIONS[entry.id] === metadata.version
    );
  });
  readonly dependencies = computed(() => this.dependencyRows(this.metadata()?.dependencies));
  readonly peerDependencies = computed(() =>
    this.dependencyRows(this.metadata()?.peerDependencies),
  );
  readonly packageTitle = computed(() => this.entry()?.id ?? '');
  readonly referencePage = computed(() =>
    this.packageId() === 'i18n'
      ? I18N_DOC_PAGES.find((page) => page.section === this.section())
      : this.packageId() === 'theme'
        ? THEME_DOC_PAGES.find((page) => page.section === this.section())
        : undefined,
  );
  readonly pageTitle = computed(() => {
    const reference = this.referencePage();
    if (reference) return this.i18n.translate(reference.titleKey);
    const section = this.routeParams().get('section');
    const currentSection = this.section();
    if (this.packageId() === 'theme')
      return this.i18n.translate(this.referencePage()?.titleKey ?? 'docs.theme.overview.title');
    if (this.packageId() !== 'http') return this.packageTitle();
    if (currentSection === 'quick-start') return this.i18n.translate('docs.http.title.quick-start');
    if (currentSection === 'guides') return this.i18n.translate('docs.http.title.guides');
    if (currentSection === 'api') return this.i18n.translate('docs.http.title.api');
    if (currentSection === 'changelog') return this.i18n.translate('docs.http.title.changelog');
    if (currentSection.startsWith('guides-')) {
      return this.i18n.translate(`docs.http.title.${currentSection}`);
    }
    return this.packageTitle();
  });
  readonly versionLabel = computed(() => {
    const version = this.metadata()?.version ?? '';
    return version.startsWith('0.') ? this.i18n.translate('docs.preOne') : version;
  });

  private dependencyRows(
    dependencies: Readonly<Record<string, string>> | undefined,
  ): readonly DocsDependencyRow[] {
    return Object.entries(dependencies ?? {}).map(([name, range]) => {
      const dependencyId = name.replace(/^@rivinia\//, '');
      const installedVersion =
        PACKAGE_METADATA[dependencyId as keyof typeof PACKAGE_METADATA]?.version;
      return { name, range, installedVersion };
    });
  }
}
