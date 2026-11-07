import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { beforeEach, describe, expect, it } from 'vitest';

import { appIcons } from '../../../shared/components/icon/icon-registry';
import { DocsHubComponent } from './docs-hub.component';

const translations: Record<string, string> = {
  'page.docs.title': 'Docs',
  'docs.hub.lead': 'Package overviews.',
  'docs.gettingStarted': 'Getting started',
  'docs.groups.foundations': 'Foundations',
  'docs.groups.components': 'Components',
  'docs.groups.primitives': 'Primitives',
  'docs.filter.label': 'Filter packages',
  'docs.filter.placeholder': 'Search packages',
  'docs.filter.count': 'results',
  'docs.filter.empty': 'No packages found',
  'docs.copyHeadingLink': 'Copy heading link',
  'docs.headingLinkCopied': 'Link copied',
  'docs.headingLinkFailed': 'Could not copy link',
  'docs.uiEntry': 'UI',
  'common.copyCodeLabel': 'Copy',
  'common.copyCodeSuccess': 'Copied',
  'common.copyCodeError': 'Could not copy',
};

describe('DocsHubComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsHubComponent],
      providers: [
        provideRouter([]),
        provideLucideIcons(...Object.values(appIcons)),
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();
  });

  async function render() {
    const fixture = TestBed.createComponent(DocsHubComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function visiblePackageIds(fixture: Awaited<ReturnType<typeof render>>): string[] {
    return [...fixture.nativeElement.querySelectorAll('.package-row h3')].map(
      (heading: HTMLElement) => heading.textContent?.trim() ?? '',
    );
  }

  it('renders every package group when no filter is active', async () => {
    const fixture = await render();

    expect(visiblePackageIds(fixture).length).toBeGreaterThan(3);
    expect(fixture.nativeElement.querySelectorAll('.package-group').length).toBe(3);
  });

  it('filters packages by description text, not only by id or name', async () => {
    const fixture = await render();
    const input = fixture.nativeElement.querySelector(
      '#docs-hub-package-filter',
    ) as HTMLInputElement;

    input.value = 'envelope';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(visiblePackageIds(fixture)).toEqual(['http']);
  });
});
