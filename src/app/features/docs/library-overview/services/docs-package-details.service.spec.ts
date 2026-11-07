import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { DocsPackageDetailsService } from './docs-package-details.service';

const translations: Record<string, string> = {
  'docs.preOne': 'pre-1.0',
  'docs.http.title.guides-resources': 'Reactive resources with signals',
};

describe('DocsPackageDetailsService', () => {
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let routeData: BehaviorSubject<Record<string, unknown>>;

  beforeEach(async () => {
    params = new BehaviorSubject(convertToParamMap({ package: 'select' }));
    routeData = new BehaviorSubject<Record<string, unknown>>({});
    await TestBed.configureTestingModule({
      providers: [
        DocsPackageDetailsService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: params.asObservable(),
            data: routeData.asObservable(),
            snapshot: { paramMap: convertToParamMap({ package: 'select' }) },
          },
        },
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    });
  });

  it('resolves metadata, guide and install command for a known package', () => {
    const service = TestBed.inject(DocsPackageDetailsService);

    expect(service.packageTitle()).toBe('select');
    expect(service.metadata()?.version).toBe('1.0.4');
    expect(service.guide()).not.toBeNull();
    expect(service.installCommand()).toBe('npm i @rivinia/select');
    expect(service.published()).toBe(true);
    expect(service.versionLabel()).toBe('1.0.4');
  });

  it('maps dependencies with their range and installed version', () => {
    const service = TestBed.inject(DocsPackageDetailsService);
    const popup = service.dependencies().find((row) => row.name === '@rivinia/popup');

    expect(popup).toEqual({ name: '@rivinia/popup', range: '^1.0.4', installedVersion: '1.0.4' });
  });

  it('clears details when the route points at an unknown package', () => {
    const service = TestBed.inject(DocsPackageDetailsService);

    params.next(convertToParamMap({ package: 'not-a-package' }));
    TestBed.tick();

    expect(service.entry()).toBeNull();
    expect(service.metadata()).toBeNull();
    expect(service.guide()).toBeNull();
    expect(service.published()).toBe(false);
    expect(service.installCommand()).toBe('');
    expect(service.dependencies()).toEqual([]);
  });

  it('resolves package and section supplied by a componentless parent route', () => {
    params.next(convertToParamMap({}));
    routeData.next({ docsPackageId: 'http', section: 'guides-resources' });
    TestBed.tick();

    const service = TestBed.inject(DocsPackageDetailsService);
    expect(service.packageId()).toBe('http');
    expect(service.section()).toBe('guides-resources');
    expect(service.metadata()?.name).toBe('@rivinia/http');
    expect(service.pageTitle()).toBe('docs.http.title.guides-resources');
  });
});
