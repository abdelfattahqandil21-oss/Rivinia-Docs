import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ShowcaseExampleSource } from '../../../showcase/showcase-example.model';
import { DocsPackageDetailsService } from './docs-package-details.service';
import { DOCS_QUICK_START_LOADER, DocsQuickStartService } from './docs-quick-start.service';

const translations: Record<string, string> = {
  'docs.preOne': 'pre-1.0',
};

const selectSource: ShowcaseExampleSource = {
  html: '<div></div>',
  typescript: 'export {};',
  codeBlocks: [
    { id: 'ui-single-basic', titleKey: 'docs.block.basic', language: 'html', code: '<p></p>' },
    { id: 'headless-basic', titleKey: 'docs.block.headless', language: 'ts', code: 'const x = 1;' },
  ],
};

describe('DocsQuickStartService', () => {
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let loadSource: ReturnType<typeof vi.fn>;

  function configure(packageId: string, source: ShowcaseExampleSource = selectSource) {
    params = new BehaviorSubject(convertToParamMap({ package: packageId }));
    loadSource = vi.fn(async () => source);
    TestBed.configureTestingModule({
      providers: [
        DocsPackageDetailsService,
        DocsQuickStartService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: params.asObservable(),
            snapshot: { paramMap: convertToParamMap({ package: packageId }) },
          },
        },
        { provide: DOCS_QUICK_START_LOADER, useValue: loadSource },
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    });
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('loads the example source and keeps the select UI single-file blocks', async () => {
    configure('select');
    const service = TestBed.inject(DocsQuickStartService);

    await TestBed.inject(ApplicationRef).whenStable();
    await Promise.resolve();

    expect(loadSource).toHaveBeenCalledWith('select');
    expect(service.showLiveExample()).toBe(true);
    expect(service.files()).toEqual([
      {
        name: 'select.component.html',
        language: 'html',
        code: '<p></p>',
      },
    ]);
  });

  it('does not load a source for packages without a live example', async () => {
    configure('http');
    const service = TestBed.inject(DocsQuickStartService);

    await TestBed.inject(ApplicationRef).whenStable();
    await Promise.resolve();

    expect(loadSource).not.toHaveBeenCalled();
    expect(service.showLiveExample()).toBe(false);
    expect(service.files()).toEqual([]);
  });
});
