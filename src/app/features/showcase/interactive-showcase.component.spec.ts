import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { provideRiviniaToast } from '@rivinia/toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  InteractiveShowcaseComponent,
  SHOWCASE_EXAMPLE_LOADERS,
} from './interactive-showcase.component';
import type { ShowcaseExampleId, ShowcaseExampleLoaders } from './showcase-example.model';
import { appIcons } from '../../shared/components/icon/icon-registry';

@Component({
  selector: 'app-test-preview',
  template: '<p>Loaded preview</p>',
})
class TestPreviewComponent {}

const sourceFor = (id: ShowcaseExampleId) => ({
  html: `<${id}-preview />`,
  typescript: `// ${id} example`,
});

const translations = {
  'showcase.title': 'Experience Rivinia',
  'showcase.description': 'Real components',
  'showcase.allPackages': 'All packages',
  'showcase.examples': 'Examples',
  'showcase.views': 'Views',
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
  'showcase.codeFiles': 'Source files',
  'showcase.copy': 'Copy code',
  'showcase.copied': 'Copied',
  'showcase.copyError': 'Copy failed',
  'showcase.select.name': 'Select',
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
      (button) => button.getAttribute('aria-pressed') === 'true',
    );
    expect(selectedButton.textContent).toContain('Select');
    expect(loaders.select).toHaveBeenCalledOnce();
    expect(loaders.datepicker).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Loaded preview');
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
    expect(loaders.datepicker).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.code-sample code').textContent).toContain(
      '<table-preview />',
    );

    const codeButton = fixture.nativeElement.querySelector(
      '.view-switch button[aria-label="Code"]',
    ) as HTMLButtonElement;
    codeButton.click();
    fixture.detectChanges();
    expect(codeButton.getAttribute('aria-pressed')).toBe('true');
    expect(tableButton.getAttribute('aria-pressed')).toBe('true');
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
    expect(fixture.nativeElement.querySelector('.code-sample code').textContent).toContain(
      '<toast-preview />',
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
    expect(fixture.nativeElement.querySelector('.copy-status').textContent).toContain('Copied');
  });

  it('links to the existing package catalog route', async () => {
    const fixture = createFixture();
    await fixture.whenStable();
    fixture.detectChanges();

    const docsLink = fixture.nativeElement.querySelector(
      '.documentation-link',
    ) as HTMLAnchorElement;
    expect(docsLink.getAttribute('href')).toBe('/components');
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

    expect(tableButton.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.querySelector('.code-sample code').textContent).toContain(
      '<table-preview />',
    );
  });
});
