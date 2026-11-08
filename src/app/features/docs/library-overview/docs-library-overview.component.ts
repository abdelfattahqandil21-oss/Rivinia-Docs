import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../../shared/components/code-block/code-block.component';
import { DocsReferencePageComponent } from './components/docs-reference-page/docs-reference-page.component';
import { I18N_DOC_PAGES } from './models/docs-reference-pages.model';
import { DocsSequenceNavComponent } from '../getting-started/components/docs-sequence-nav/docs-sequence-nav.component';
import { docsLink } from '../shared/docs-link';
import { DocsDependencyListComponent } from './components/docs-dependency-list/docs-dependency-list.component';
import { DocsEnvGuideComponent } from './components/docs-env-guide/docs-env-guide.component';
import { DocsLibraryHeaderComponent } from './components/docs-library-header/docs-library-header.component';
import { DocsLibraryNotFoundComponent } from './components/docs-library-not-found/docs-library-not-found.component';
import { DocsPackageGuideComponent } from './components/docs-package-guide/docs-package-guide.component';
import { DocsQuickStartComponent } from './components/docs-quick-start/docs-quick-start.component';
import { DocsPackageDetailsService } from './services/docs-package-details.service';
import { DocsQuickStartService } from './services/docs-quick-start.service';

@Component({
  imports: [
    RouterLink,
    DocsReferencePageComponent,
    CodeBlockComponent,
    DocsLibraryHeaderComponent,
    DocsLibraryNotFoundComponent,
    DocsPackageGuideComponent,
    DocsQuickStartComponent,
    DocsDependencyListComponent,
    DocsEnvGuideComponent,
    DocsSequenceNavComponent,
  ],
  providers: [DocsPackageDetailsService, DocsQuickStartService],
  selector: 'app-docs-library-overview',
  templateUrl: './docs-library-overview.component.html',
  styleUrl: './docs-library-overview.component.css',
})
export class DocsLibraryOverviewComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly details = inject(DocsPackageDetailsService);
  protected readonly quickStart = inject(DocsQuickStartService);
  protected get isEnvPackage(): boolean {
    return this.details.packageId() === 'env';
  }
  protected get isHttpPackage(): boolean {
    return this.details.packageId() === 'http';
  }
  protected get isHttpOverview(): boolean {
    return this.isHttpPackage && !this.details.section();
  }

  protected readonly referencePages = I18N_DOC_PAGES;
  protected readonly notFoundTitle = this.i18n.t('docs.notFound.title');
  protected readonly notFoundBody = this.i18n.t('docs.notFound.body');
  protected readonly notFoundLink = docsLink();
  protected readonly httpChangelogUrl =
    'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.4/projects/http/CHANGELOG.md';
  protected readonly httpChangelog = [{ version: '1.0.4', text: 'docs.http.changelog.1.0.4' }];
  protected readonly httpGuideLinks = [
    { path: '/docs/http/guides/configuration', label: 'docs.http.guide.guides-configuration' },
    { path: '/docs/http/guides/observables', label: 'docs.http.guide.guides-observables' },
    { path: '/docs/http/guides/resources', label: 'docs.http.guide.guides-resources' },
    { path: '/docs/http/guides/responses', label: 'docs.http.guide.guides-responses' },
    { path: '/docs/http/guides/testing', label: 'docs.http.guide.guides-testing' },
  ];
  protected readonly httpSeparateSetup = `import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRiviniaHttp } from '@rivinia/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRiviniaHttp(),
  ],
};`;
  protected readonly httpFeaturesSetup = `import { withInterceptors } from '@angular/common/http';
import { provideRiviniaHttp } from '@rivinia/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig = {
  providers: [
    provideRiviniaHttp({
      httpFeatures: [withInterceptors([authInterceptor])],
    }),
  ],
};`;
  protected readonly httpExistingSetup = `import { provideRiviniaHttp } from '@rivinia/http';

export const appConfig = {
  providers: [
    // Keep your existing provideHttpClient(...) configuration and features.
    provideRiviniaHttp(),
  ],
};`;
  protected readonly httpObservableExample = `import { Service } from '@angular/core';
import { injectRiviniaHttp, joinUrl } from '@rivinia/http';
import type { Observable } from 'rxjs';

@Service()
export class TripApi {
  private readonly http = injectRiviniaHttp();
  private readonly tripsUrl = joinUrl('/api', 'trips');

  list(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }
}`;
  protected readonly httpInstallCommands = 'npm install @rivinia/http\nng add @rivinia/http';
  protected readonly httpResourceExample = `readonly page = signal(1);
readonly trips = this.http.getResource<Trip[]>(
  joinUrl(environment.apiUrl, 'trips'),
  {
    params: () => ({ page: this.page() }),
    unwrap: true,
    unwrapKey: 'data',
  },
);

nextPage(): void {
  this.page.update((value) => value + 1);
}`;
  protected readonly httpEnvelopeExample = `this.http.get<Trip[]>(url); // raw response body
this.http.get<Trip[]>(url, {
  unwrap: true,
  unwrapKey: 'data',
});`;
  protected readonly httpApiMethodsExample = `import type { Observable } from 'rxjs';
import type { HttpResponse } from '@angular/common/http';

list(): Observable<Trip[]> {
  return this.http.get<Trip[]>(this.tripsUrl, { params: { page: 1 } });
}

create(draft: TripDraft): Observable<Trip> {
  return this.http.post<Trip>(this.tripsUrl, draft);
}

replace(id: string, trip: TripDraft): Observable<Trip> {
  return this.http.put<Trip>(joinUrl(this.tripsUrl, id), trip);
}

update(id: string, changes: Partial<TripDraft>): Observable<Trip> {
  return this.http.patch<Trip>(joinUrl(this.tripsUrl, id), changes);
}

remove(id: string): Observable<void> {
  return this.http.delete<void>(joinUrl(this.tripsUrl, id));
}

download(id: string): Observable<Blob> {
  return this.http.getBlob(joinUrl('/api', 'receipts', id));
}

getCsv(): Observable<string> {
  return this.http.getText(joinUrl('/api', 'trips.csv'));
}

createAndReadLocation(draft: TripDraft): Observable<HttpResponse<Trip>> {
  return this.http.postResponse<Trip>(this.tripsUrl, draft);
}`;
  protected readonly httpApiRequestExample = `this.http.get<Trip[]>(this.tripsUrl, {
  params: { page: 1, includeCancelled: false },
  headers: { 'X-Client': 'web' },
  withCredentials: true,
});`;
  protected readonly httpApiResourceExample = `readonly page = signal(1);
readonly trips = this.http.getResource<Trip[]>(
  joinUrl(environment.apiUrl, 'trips'),
  {
    params: () => ({ page: this.page() }),
    unwrap: true,
    unwrapKey: 'data',
    parse: parseTrips,
  },
);`;
  protected readonly httpApiEnvelopeExample = `provideRiviniaHttp({
  envelope: { successKey: 'ok', errorKey: 'message' },
});

this.http.get<Trip[]>(this.tripsUrl, {
  unwrap: true,
  unwrapKey: 'result',
});`;
  protected readonly httpProviderRows = [
    { api: 'provideRiviniaHttp(config?)', contract: 'docs.http.api.providerRow' },
    { api: 'injectRiviniaHttp()', contract: 'docs.http.api.injectRow' },
    { api: 'RiviniaHttp', contract: 'docs.http.api.clientRow' },
  ];
  protected readonly httpJobRows = [
    {
      job: 'docs.http.api.job.urlTitle',
      api: 'joinUrl(base, endpoint)',
      contract: 'docs.http.api.job.url',
    },
    {
      job: 'docs.http.api.job.unwrapTitle',
      api: 'extractKey(body, key) / unwrapAs<T>()',
      contract: 'docs.http.api.job.unwrap',
    },
    {
      job: 'docs.http.api.job.resourceTitle',
      api: 'getResource<T>()',
      contract: 'docs.http.api.job.resource',
    },
    {
      job: 'docs.http.api.job.stateTitle',
      api: 'value(), hasValue(), isLoading(), error(), reload()',
      contract: 'docs.http.api.job.state',
    },
  ];
  protected readonly httpMethodRows = [
    {
      method: 'get<T>(url, options?)',
      returns: 'Observable<T>',
      example: 'this.http.get<Trip[]>(this.tripsUrl)',
    },
    {
      method: 'post<T>(url, body?, options?)',
      returns: 'Observable<T>',
      example: 'this.http.post<Trip>(this.tripsUrl, draft)',
    },
    {
      method: 'put<T>(url, body?, options?)',
      returns: 'Observable<T>',
      example: 'this.http.put<Trip>(url, replacement)',
    },
    {
      method: 'patch<T>(url, body?, options?)',
      returns: 'Observable<T>',
      example: 'this.http.patch<Trip>(url, changes)',
    },
    {
      method: 'delete<T>(url, options?)',
      returns: 'Observable<T>',
      example: 'this.http.delete<void>(url)',
    },
    {
      method: 'getBlob(url, options?)',
      returns: 'Observable<Blob>',
      example: 'this.http.getBlob(fileUrl)',
    },
    {
      method: 'getText(url, options?)',
      returns: 'Observable<string>',
      example: 'this.http.getText(csvUrl)',
    },
    {
      method: 'getResponse<T>(url, options?)',
      returns: 'Observable<HttpResponse<T>>',
      example: 'this.http.getResponse<Trip[]>(this.tripsUrl)',
    },
    {
      method: 'postResponse<T>(url, body?, options?)',
      returns: 'Observable<HttpResponse<T>>',
      example: 'this.http.postResponse<Trip>(this.tripsUrl, draft)',
    },
  ];
  protected readonly httpContractRows = [
    { shape: 'RiviniaHttpConfig', contract: 'docs.http.api.shape.config' },
    { shape: 'RiviniaRequestOptions', contract: 'docs.http.api.shape.request' },
    { shape: 'RiviniaRawOptions', contract: 'docs.http.api.shape.raw' },
    { shape: 'RiviniaDeleteRequestOptions', contract: 'docs.http.api.shape.delete' },
    { shape: 'RiviniaResourceOptions<T>', contract: 'docs.http.api.shape.resource' },
    { shape: 'RiviniaEnvelopePolicy', contract: 'docs.http.api.shape.envelope' },
    {
      shape: 'RiviniaHttpEnvelopeError / RiviniaHttpUnwrapError',
      contract: 'docs.http.api.shape.errors',
    },
  ];
  protected readonly httpTestExample = `TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRiviniaHttp(),
  ],
});

const api = TestBed.inject(RiviniaHttp);
const requests = TestBed.inject(HttpTestingController);
api.get<Trip[]>('/api/trips').subscribe();
requests.expectOne('/api/trips').flush([]);
requests.verify();`;
  protected readonly httpPrevious = {
    href: '/docs/http/guides/testing',
    titleKey: 'docs.http.guide.guides-testing',
  };
  protected readonly httpNext = {
    href: '/docs/http',
    titleKey: 'docs.http.page.overview',
  };

  protected httpPageLink(section: string): string {
    return section ? docsLink('http', section) : docsLink('http');
  }
}
