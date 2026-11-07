import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { beforeEach, describe, expect, it } from 'vitest';

import { appIcons } from '../../../shared/components/icon/icon-registry';
import { DocsGettingStartedComponent } from './docs-getting-started.component';

const translations: Record<string, string> = {
  'docs.startTitle': 'Choose the package for your task',
  'docs.startText': 'Start here.',
  'docs.browsePackages': 'Browse packages',
  'docs.installTitle': 'Install a package',
  'docs.installText': 'Add the package.',
  'docs.installFollowup': 'Import it.',
  'docs.continueTitle': 'Go directly to the area you need',
  'docs.componentsText': 'Components',
  'docs.playgroundText': 'Playground',
  'docs.previous': 'Previous',
  'docs.next': 'Next',
  'docs.gettingStarted': 'Getting started',
  'docs.install': 'Install',
  'docs.copyHeadingLink': 'Copy heading link',
  'docs.headingLinkCopied': 'Link copied',
  'docs.headingLinkFailed': 'Could not copy link',
  'common.copyCodeLabel': 'Copy',
  'common.copyCodeSuccess': 'Copied',
  'common.copyCodeError': 'Could not copy',
};

describe('DocsGettingStartedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'docs/getting-started/:slug',
            component: DocsGettingStartedComponent,
            data: { docsStep: 1 },
          },
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

  it('renders the step selected by route data with install content', async () => {
    const root = await render('/docs/getting-started/install-a-package');

    expect(root.querySelector('h1')?.textContent).toContain('Install a package');
    expect(root.textContent).toContain('npm install @rivinia/select');
  });

  it('links to the previous and next steps of the sequence', async () => {
    const root = await render('/docs/getting-started/install-a-package');
    const links = [...root.querySelectorAll('.sequence-link')].map((link) =>
      (link as HTMLAnchorElement).getAttribute('href'),
    );

    expect(links).toEqual([
      '/docs/getting-started/choose-the-package-for-your-task',
      '/docs/getting-started/go-directly-to-the-area-you-need',
    ]);
  });
});
