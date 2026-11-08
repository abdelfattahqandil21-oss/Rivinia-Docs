import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { beforeEach, describe, expect, it } from 'vitest';

import { appIcons } from '../../../shared/components/icon/icon-registry';
import { DocsLibraryOverviewComponent } from './docs-library-overview.component';

const translations: Record<string, string> = {
  'docs.entryPoints': 'Entry points',
  'docs.install': 'Install',
  'docs.importPaths': 'Import paths',
  'docs.packageGuide': 'Package guide',
  'docs.packageConcepts': 'Concepts',
  'docs.packageApiHighlights': 'API highlights',
  'docs.packageFurtherReading': 'Further reading',
  'docs.quickStart': 'Quick start',
  'docs.dependencies': 'Dependencies',
  'docs.peerDependencies': 'Peer dependencies',
  'docs.range': 'Range',
  'docs.installedVersion': 'Installed',
  'docs.packageUi': 'UI entry points',
  'docs.packageUiDescription': 'Ready-made UI entry points.',
  'docs.liveExample': 'Live example',
  'docs.seeLive': 'See the live example',
  'docs.preOne': 'pre-1.0',
  'docs.notFound.title': 'Package not found',
  'docs.notFound.body': 'This package is not part of the docs.',
  'docs.notFound.back': 'Back to Docs',
  'docs.http.pagesLabel': 'HTTP library pages',
  'docs.http.page.overview': 'Overview',
  'docs.http.page.quickStart': 'Quick start',
  'docs.http.page.guides': 'Guides',
  'docs.http.page.api': 'API',
  'docs.http.page.changelog': 'Changelog',
  'docs.http.guidesTitle': 'HTTP guides',
  'docs.http.guidesIndex.title': 'Choose a guide',
  'docs.http.title.guides': 'Guides',
  'docs.http.guide.guides-configuration': 'Configure the HTTP backend',
  'docs.http.guide.guides-observables': 'Observable requests',
  'docs.http.guide.guides-resources': 'Reactive resources with signals',
  'docs.http.guide.guides-responses': 'Response envelopes and errors',
  'docs.http.guide.guides-testing': 'Testing HTTP requests',
  'docs.http.title.guides-configuration': 'Configure the HTTP backend',
  'docs.http.configure.title': 'Configure the HTTP backend',
  'docs.http.configure.intro': 'Configure client providers once.',
  'docs.http.configure.separateTitle': 'Option 1: configure HttpClient separately',
  'docs.http.configure.separateText': 'Use HttpClient and Rivinia providers separately.',
  'docs.http.configure.featuresTitle': 'Option 2: pass features through provideRiviniaHttp',
  'docs.http.configure.featuresText': 'Pass features through httpFeatures.',
  'docs.http.configure.oneTitle': 'Register one backend setup',
  'docs.http.configure.oneText': 'Do not register both.',
  'docs.http.configure.existingTitle': 'If your app already provides HttpClient',
  'docs.http.configure.existingText': 'Keep existing setup.',
  'docs.guide.select.summary': 'Select summary',
  'docs.guide.select.modes': 'Modes',
  'docs.guide.select.filtering': 'Filtering',
  'docs.guide.select.forms': 'Forms',
  'docs.guide.select.api.controller': 'Controller',
  'docs.guide.select.api.component': 'Component',
  'docs.guide.select.api.change': 'Change event',
  'docs.guide.select.reference.headless': 'Headless guide',
  'docs.guide.select.reference.forms': 'Forms guide',
  'docs.guide.select.reference.accessibility': 'Accessibility guide',
  'common.copyCodeLabel': 'Copy',
  'common.copyCodeSuccess': 'Copied',
  'common.copyCodeError': 'Could not copy',
};

describe('DocsLibraryOverviewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'docs/http/guides',
            data: { docsPackageId: 'http', section: 'guides' },
            component: DocsLibraryOverviewComponent,
          },
          {
            path: 'docs/http/guides/resources',
            data: { docsPackageId: 'http', section: 'guides-resources' },
            component: DocsLibraryOverviewComponent,
          },
          {
            path: 'docs/http/guides/configuration',
            data: { docsPackageId: 'http', section: 'guides-configuration' },
            component: DocsLibraryOverviewComponent,
          },
          {
            path: 'docs/http/api',
            data: { docsPackageId: 'http', section: 'api' },
            component: DocsLibraryOverviewComponent,
          },
          {
            path: 'docs/http/changelog',
            data: { docsPackageId: 'http', section: 'changelog' },
            component: DocsLibraryOverviewComponent,
          },
          { path: 'docs/:package', component: DocsLibraryOverviewComponent },
          { path: 'docs/:package/:section', component: DocsLibraryOverviewComponent },
        ]),
        provideLucideIcons(...Object.values(appIcons)),
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();
  });

  async function render(url: string) {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return harness.routeNativeElement as HTMLElement;
  }

  it('renders the install command and verified version for a published package', async () => {
    const root = await render('/docs/select');

    expect(root.textContent).toContain('npm i @rivinia/select');
    expect(root.querySelector('.version-badge')?.textContent?.trim()).toBe('1.0.4');
  });

  it('lists dependencies with their range and installed version', async () => {
    const root = await render('/docs/select');

    expect(root.textContent).toContain('@rivinia/popup');
    expect(root.textContent).toContain('^1.0.4');
  });

  it('renders the localized not-found state for an unknown package', async () => {
    const root = await render('/docs/not-a-package');

    expect(root.textContent).toContain('Package not found');
    expect(root.textContent).toContain('Back to Docs');
  });

  it('shows both HTTP backend setup options and warns against registering both', async () => {
    const root = await render('/docs/http/guides/configuration');

    expect(root.textContent).toContain('provideHttpClient(withInterceptors([authInterceptor]))');
    expect(root.textContent).toContain('httpFeatures');
    expect(root.textContent).toContain('Do not register both.');
    expect(root.querySelector('h1')?.textContent).toContain('Configure the HTTP backend');
  });

  it('renders Guides as its own page with links to every HTTP guide', async () => {
    const root = await render('/docs/http/guides');

    expect(root.querySelector('h1')?.textContent).toContain('Guides');
    expect(root.querySelectorAll('.http-guides-index a')).toHaveLength(5);
    expect(root.querySelector('.http-guides-index')?.textContent).toContain(
      'Reactive resources with signals',
    );
  });

  it('documents HTTP providers, methods, return types, and concrete calls', async () => {
    const root = await render('/docs/http/api');

    for (const method of [
      'get<T>',
      'post<T>',
      'put<T>',
      'patch<T>',
      'delete<T>',
      'getBlob',
      'getText',
      'getResponse<T>',
      'postResponse<T>',
    ]) {
      expect(root.textContent).toContain(method);
    }
    expect(root.textContent).toContain('Observable<Blob>');
    expect(root.textContent).toContain('this.http.patch<Trip>(url, changes)');
    expect(root.textContent).toContain('provideRiviniaHttp(config?)');
    expect(root.querySelectorAll('table').length).toBeGreaterThanOrEqual(4);
  });

  it('keeps only the current 1.0.4 changelog entry', async () => {
    const root = await render('/docs/http/changelog');

    expect(root.textContent).toContain('1.0.4');
    expect(root.textContent).not.toContain('1.0.3');
  });
});
