import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { provideRiviniaToast } from '@rivinia/toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appIcons } from '../../shared/components/icon/icon-registry';
import { DATEPICKER_CODE_GROUPS } from './demos/datepicker/datepicker-code-groups';
import { InteractiveShowcaseComponent } from './interactive-showcase.component';
import { SHOWCASE_EXAMPLE_LOADERS } from './showcase-example.loaders';
import type { ShowcaseExampleId, ShowcaseExampleLoaders } from './showcase-example.model';

@Component({
  selector: 'app-test-preview',
  template: '<p>Loaded preview</p>',
})
class TestPreviewComponent {
  readonly viewMode = input<'headless' | 'ui'>('ui');
  readonly selectionMode = input<'single' | 'multi'>('single');
}

const sourceFor = (id: ShowcaseExampleId) => ({
  html: `<${id}-preview />`,
  typescript: `// ${id} example`,
  css: `.example-${id} { color: inherit; }`,
  ...(id === 'select'
    ? {
        codeBlocks: [
          {
            id: 'ui-single-html',
            titleKey: 'showcase.select.singleTitle',
            language: 'html' as const,
            code: `<${id}-preview />`,
          },
          {
            id: 'ui-single-typescript',
            titleKey: 'showcase.select.singleState',
            language: 'ts' as const,
            code: 'export class SelectExampleComponent {}',
          },
          {
            id: 'ui-single-css',
            titleKey: 'showcase.select.singleState',
            language: 'css' as const,
            code: ':host { display: block; }',
          },
        ],
      }
    : {}),
});

const translations = {
  'common.copyCodeLabel': 'Copy code',
  'showcase.title': 'Experience Rivinia',
  'showcase.eyebrow': 'Examples',
  'showcase.description': 'Real components',
  'showcase.allPackages': 'All packages',
  'showcase.examples': 'Examples',
  'showcase.views': 'Views',
  'showcase.demoMode': 'Example mode',
  'showcase.preview': 'Preview',
  'showcase.code': 'Code',
  'showcase.livePreview': 'Live preview',
  'showcase.live': 'Interactive',
  'showcase.loading': 'Loading example',
  'showcase.loadingCode': 'Loading code',
  'showcase.codeUnavailable': 'No code',
  'showcase.loadError': 'Example failed',
  'showcase.retry': 'Retry',
  'showcase.packageDocumentation': 'Package docs',
  'showcase.readDocs': 'Read the docs',
  'showcase.codeFiles': 'Source files',
  'showcase.codeGroups': 'Datepicker examples',
  'showcase.sourceFiles': 'Example source files',
  'showcase.datepicker.code.date': 'Date',
  'showcase.datepicker.code.time': 'Time',
  'showcase.datepicker.code.dateTime': 'Date and time',
  'showcase.sourceTypeScript': 'TypeScript',
  'showcase.sourceHtml': 'HTML',
  'showcase.sourceCss': 'CSS',
  'common.copyCodeSuccess': 'Copied to clipboard',
  'common.copyCodeError': 'Copy failed',
  'showcase.select.name': 'Select',
  'showcase.select.selectionMode': 'Selection mode',
  'showcase.select.single': 'Single',
  'showcase.select.multiple': 'Multiple',
  'showcase.select.singleTitle': 'Single selection',
  'showcase.datepicker.name': 'Datepicker',
  'showcase.table.name': 'Table',
  'showcase.modal.name': 'Modal',
  'showcase.toast.name': 'Toast',
};

function makeLoaders(): ShowcaseExampleLoaders {
  return {
    select: vi.fn(async () => ({ component: TestPreviewComponent, source: sourceFor('select') })),
    datepicker: vi.fn(async () => ({
      component: TestPreviewComponent,
      source: sourceFor('datepicker'),
    })),
    table: vi.fn(async () => ({ component: TestPreviewComponent, source: sourceFor('table') })),
    modal: vi.fn(async () => ({ component: TestPreviewComponent, source: sourceFor('modal') })),
    toast: vi.fn(async () => ({ component: TestPreviewComponent, source: sourceFor('toast') })),
  };
}

describe('InteractiveShowcaseComponent', () => {
  let loaders: ShowcaseExampleLoaders;

  beforeEach(async () => {
    loaders = makeLoaders();
    await TestBed.configureTestingModule({
      imports: [InteractiveShowcaseComponent],
      providers: [
        provideRouter([]),
        provideLucideIcons(...Object.values(appIcons)),
        provideRiviniaToast(),
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
        { provide: SHOWCASE_EXAMPLE_LOADERS, useValue: loaders },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    Reflect.deleteProperty(window.navigator, 'clipboard');
  });

  function createFixture(): ComponentFixture<InteractiveShowcaseComponent> {
    const fixture = TestBed.createComponent(InteractiveShowcaseComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('loads only Select initially and renders its real preview slot', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const selectedButton = [...fixture.nativeElement.querySelectorAll('.example-tab')].find(
      (button) => button.getAttribute('aria-selected') === 'true',
    );
    expect(selectedButton.textContent).toContain('Select');
    const tabs = fixture.nativeElement.querySelector('.example-tabs') as HTMLElement;
    expect(tabs.style.getPropertyValue('--showcase-tab-count')).toBe('5');
    expect(tabs.style.getPropertyValue('--selected-width')).toBe('20%');
    expect(loaders.select).toHaveBeenCalledOnce();
    expect(loaders.datepicker).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Loaded preview');
    const viewButtons = [...fixture.nativeElement.querySelectorAll('.view-switch button')];
    expect(viewButtons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Preview',
      'Code',
    ]);
    expect(viewButtons.map((button) => button.getAttribute('title'))).toEqual(['Preview', 'Code']);
    expect(viewButtons.every((button) => button.textContent.trim() === '')).toBe(true);
  });

  it('shows Select source in separate HTML, TypeScript, and CSS tabs', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const tabs = [...fixture.nativeElement.querySelectorAll('.source-file-tabs [role="tab"]')];
    expect(tabs.map((tab) => tab.textContent.trim())).toEqual(['HTML', 'TypeScript', 'CSS']);
    expect(fixture.nativeElement.querySelectorAll('.source-file-view app-code-block')).toHaveLength(
      1,
    );

    (tabs[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('.source-file-view app-code-block').textContent,
    ).toContain(':host { display: block; }');
  });

  it('loads a selected example on demand and preserves it while switching views', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const tableButton = [...fixture.nativeElement.querySelectorAll('button')].find((button) =>
      button.textContent.includes('Table'),
    ) as HTMLButtonElement;
    tableButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loaders.table).toHaveBeenCalledOnce();
    const tabs = fixture.nativeElement.querySelector('.example-tabs') as HTMLElement;
    expect(tabs.style.getPropertyValue('--selected-position')).toBe('40%');
    expect(loaders.datepicker).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.code-block pre code').textContent).toContain(
      '<table-preview />',
    );

    const codeButton = [...fixture.nativeElement.querySelectorAll('.view-switch button')].find(
      (button) => button.getAttribute('aria-label') === 'Code',
    ) as HTMLButtonElement;
    codeButton.click();
    fixture.detectChanges();
    expect(codeButton.getAttribute('aria-pressed')).toBe('true');
    expect(tableButton.getAttribute('aria-selected')).toBe('true');
  });

  it('loads the Toast example on demand', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const toastButton = [...fixture.nativeElement.querySelectorAll('.example-tab')].find((button) =>
      button.textContent.includes('Toast'),
    ) as HTMLButtonElement;
    toastButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loaders.toast).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('.code-block pre code').textContent).toContain(
      '<toast-preview />',
    );
  });

  it('shows one source file at a time and supports keyboard navigation between file tabs', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const tableButton = [...fixture.nativeElement.querySelectorAll('.example-tab')].find((button) =>
      button.textContent.includes('Table'),
    ) as HTMLButtonElement;
    tableButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const tabs = [...fixture.nativeElement.querySelectorAll('.source-file-tabs [role="tab"]')];
    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab) => tab.textContent.trim())).toEqual(['HTML', 'TypeScript', 'CSS']);
    expect(fixture.nativeElement.querySelectorAll('.source-file-view app-code-block')).toHaveLength(
      1,
    );

    (tabs[0] as HTMLButtonElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('groups Datepicker source into three cases with HTML, TypeScript, and CSS files', async () => {
    const groupedLoaders: ShowcaseExampleLoaders = {
      ...makeLoaders(),
      datepicker: vi.fn(async () => ({
        component: TestPreviewComponent,
        source: { ...sourceFor('datepicker'), codeGroups: DATEPICKER_CODE_GROUPS },
      })),
    };
    TestBed.overrideProvider(SHOWCASE_EXAMPLE_LOADERS, { useValue: groupedLoaders });
    const fixture = createFixture();
    await fixture.whenStable();

    const datepickerButton = [...fixture.nativeElement.querySelectorAll('.example-tab')].find(
      (button) => button.textContent.includes('Datepicker'),
    ) as HTMLButtonElement;
    datepickerButton.click();
    await fixture.whenStable();
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector(
        '.view-switch button[aria-label="Code"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    const groupTabs = [
      ...fixture.nativeElement.querySelectorAll('.source-group-tabs [role="tab"]'),
    ];
    expect(groupTabs.map((tab) => tab.textContent.trim())).toEqual([
      'Date',
      'Time',
      'Date and time',
    ]);
    expect(fixture.nativeElement.querySelectorAll('.source-file-tabs [role="tab"]')).toHaveLength(
      3,
    );

    (groupTabs[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(groupTabs[1].getAttribute('aria-selected')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('.source-file-view app-code-block').textContent,
    ).toContain('rv-time-row');
    expect(fixture.nativeElement.querySelectorAll('.source-file-tabs [role="tab"]')).toHaveLength(
      3,
    );
  });

  it('shows an accessible failure state and retries the selected loader', async () => {
    const failingLoaders: ShowcaseExampleLoaders = {
      ...makeLoaders(),
      datepicker: vi
        .fn()
        .mockRejectedValueOnce(new Error('chunk failed'))
        .mockResolvedValue({ component: TestPreviewComponent, source: sourceFor('datepicker') }),
    };
    TestBed.overrideProvider(SHOWCASE_EXAMPLE_LOADERS, { useValue: failingLoaders });
    const fixture = createFixture();
    await fixture.whenStable();

    const dateButton = [...fixture.nativeElement.querySelectorAll('button')].find((button) =>
      button.textContent.includes('Datepicker'),
    ) as HTMLButtonElement;
    dateButton.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();

    (fixture.nativeElement.querySelector('.error-state button') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(failingLoaders.datepicker).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('<datepicker-preview />');
  });

  it('copies the currently selected source and announces the result', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.copy-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('<select-preview />');
    expect(
      fixture.nativeElement.querySelector('app-copy-button [aria-live]').textContent,
    ).toContain('Copied to clipboard');
  });

  it('links to the existing package catalog route', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const docsLink = fixture.nativeElement.querySelector(
      '.documentation-link',
    ) as HTMLAnchorElement;
    expect(docsLink.getAttribute('href')).toBe('/docs');
    expect(docsLink.parentElement?.querySelector('.showcase-workspace')).not.toBeNull();
    expect(docsLink.closest('.preview-pane')).toBeNull();
  });

  it('ignores an older lazy response after a newer example has been selected', async () => {
    let resolveDatepicker!: (
      value: Awaited<ReturnType<ShowcaseExampleLoaders['datepicker']>>,
    ) => void;
    const racingLoaders: ShowcaseExampleLoaders = {
      ...makeLoaders(),
      datepicker: () =>
        new Promise((resolve) => {
          resolveDatepicker = resolve;
        }),
    };
    TestBed.overrideProvider(SHOWCASE_EXAMPLE_LOADERS, { useValue: racingLoaders });
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const dateButton = [...fixture.nativeElement.querySelectorAll('button')].find((button) =>
      button.textContent.includes('Datepicker'),
    ) as HTMLButtonElement;
    dateButton.click();
    fixture.detectChanges();
    const tableButton = [...fixture.nativeElement.querySelectorAll('button')].find((button) =>
      button.textContent.includes('Table'),
    ) as HTMLButtonElement;
    tableButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    resolveDatepicker({ component: TestPreviewComponent, source: sourceFor('datepicker') });
    await Promise.resolve();
    fixture.detectChanges();

    expect(tableButton.getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.querySelector('.code-block pre code').textContent).toContain(
      '<table-preview />',
    );
  });
});
