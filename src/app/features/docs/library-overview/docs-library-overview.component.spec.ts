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
        provideRouter([{ path: 'docs/:package', component: DocsLibraryOverviewComponent }]),
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
});
