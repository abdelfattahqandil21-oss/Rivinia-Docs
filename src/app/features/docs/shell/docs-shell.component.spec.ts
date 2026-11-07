import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { appIcons } from '../../../shared/components/icon/icon-registry';
import { DocsShellComponent } from './docs-shell.component';

@Component({
  selector: 'app-test-page',
  template: '<p>page</p>',
})
class TestPageComponent {}

const translations: Record<string, string> = {
  'page.docs.title': 'Docs',
  'docs.library': 'Library',
  'docs.startTitle': 'Choose a package',
  'docs.startNavTitle': 'Choose',
  'docs.installNavTitle': 'Install',
  'docs.continueNavTitle': 'Explore',
  'docs.navigation': 'Documentation navigation',
  'docs.gettingStarted': 'Getting started',
  'docs.groups.foundations': 'Foundations',
  'docs.groups.components': 'Components',
  'docs.groups.primitives': 'Primitives',
  'docs.filter.label': 'Filter packages',
  'docs.filter.placeholder': 'Search packages',
  'docs.filter.count': 'results',
  'docs.filter.empty': 'No packages found',
  'docs.closeMenu': 'Close menu',
  'docs.collapseSidebar': 'Collapse sidebar',
  'docs.expandSidebar': 'Show sidebar',
  'docs.onThisPage': 'On this page',
  'docs.notFound.title': 'Not found',
};

const routes = [
  {
    path: 'docs/getting-started/:slug',
    component: TestPageComponent,
    data: { docsTitleKey: 'docs.startTitle' },
  },
  {
    path: 'docs/:package',
    component: TestPageComponent,
    data: { docsTitleKey: 'docs.library' },
  },
  {
    path: 'docs',
    component: TestPageComponent,
    data: { docsTitleKey: 'page.docs.title' },
  },
];

describe('DocsShellComponent', () => {
  let router: Router;

  beforeEach(async () => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: vi.fn(),
      configurable: true,
      writable: true,
    });
    await TestBed.configureTestingModule({
      imports: [DocsShellComponent],
      providers: [
        provideRouter(routes),
        provideLucideIcons(...Object.values(appIcons)),
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  async function render(url: string) {
    await router.navigateByUrl(url);
    const fixture = TestBed.createComponent(DocsShellComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function accordionTrigger(fixture: Awaited<ReturnType<typeof render>>, panel: string) {
    return fixture.nativeElement.querySelector(
      `#docs-sidebar-desktop .nav-accordion-trigger[aria-controls="docs-desktop-${panel}"]`,
    ) as HTMLButtonElement;
  }

  function packageLinks(fixture: Awaited<ReturnType<typeof render>>): string[] {
    return [
      ...fixture.nativeElement.querySelectorAll('#docs-sidebar-desktop .sidebar-nav a[lang="en"]'),
    ].map((link: HTMLAnchorElement) => link.textContent?.trim() ?? '');
  }

  it('filters package links by id or name from the sidebar filter', async () => {
    const fixture = await render('/docs');
    const input = fixture.nativeElement.querySelector('#docs-sidebar-filter') as HTMLInputElement;

    expect(packageLinks(fixture).length).toBeGreaterThan(1);

    input.value = 'select';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(packageLinks(fixture)).toEqual(['select']);
  });

  it('shows an empty state when the filter matches no package', async () => {
    const fixture = await render('/docs');
    const input = fixture.nativeElement.querySelector('#docs-sidebar-filter') as HTMLInputElement;

    input.value = 'no-such-package';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(packageLinks(fixture)).toEqual([]);
    expect(fixture.nativeElement.querySelector('#docs-sidebar-desktop .empty-filter')).toBeTruthy();
  });

  it('keeps a single accordion group open at a time', async () => {
    const fixture = await render('/docs');
    const gettingStarted = accordionTrigger(fixture, 'getting-started');
    const components = accordionTrigger(fixture, 'group-components');

    expect(gettingStarted.getAttribute('aria-expanded')).toBe('false');

    gettingStarted.click();
    fixture.detectChanges();
    expect(gettingStarted.getAttribute('aria-expanded')).toBe('true');

    components.click();
    fixture.detectChanges();
    expect(components.getAttribute('aria-expanded')).toBe('true');
    expect(gettingStarted.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the package group of the current package route on first load', async () => {
    const fixture = await render('/docs/select');

    expect(accordionTrigger(fixture, 'group-components').getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('opens Getting started for a getting-started route on first load', async () => {
    const fixture = await render('/docs/getting-started/install-a-package');

    expect(accordionTrigger(fixture, 'getting-started').getAttribute('aria-expanded')).toBe('true');
  });

  it('sets the initial accordion without changing the document title', async () => {
    const title = TestBed.inject(Title);
    title.setTitle('sentinel');
    await router.navigateByUrl('/docs/select');

    const fixture = TestBed.createComponent(DocsShellComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(accordionTrigger(fixture, 'group-components').getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(title.getTitle()).toBe('sentinel');
  });

  it('updates the document title and accordion after in-app navigation', async () => {
    const fixture = await render('/docs');

    await router.navigateByUrl('/docs/select');
    fixture.detectChanges();

    expect(TestBed.inject(Title).getTitle()).toContain('@rivinia/select');
    expect(accordionTrigger(fixture, 'group-components').getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('keeps the page rail rendered when the sidebar is collapsed', async () => {
    const fixture = await render('/docs');
    const layout = fixture.nativeElement.querySelector('.docs-layout') as HTMLElement;
    const collapse = fixture.nativeElement.querySelector(
      '.docs-sidebar-toggle',
    ) as HTMLButtonElement;

    collapse.click();
    fixture.detectChanges();

    expect(layout.classList.contains('sidebar-collapsed')).toBe(true);
    expect(fixture.nativeElement.querySelector('.docs-page-rail')).toBeTruthy();
  });
});
