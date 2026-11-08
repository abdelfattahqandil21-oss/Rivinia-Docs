import { Routes } from '@angular/router';

import {
  I18N_DOC_NAV,
  THEME_DOC_NAV,
} from './library-overview/models/docs-library-navigation.model';

import { GETTING_STARTED_PAGES } from './getting-started/models/docs-getting-started.model';

export const DOCS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        title: 'Docs · Rivinia Docs',
        data: { docsTitleKey: 'page.docs.title' },
        loadComponent: () => import('./hub/docs-hub.component').then((m) => m.DocsHubComponent),
      },
      ...GETTING_STARTED_PAGES.map((page, docsStep) => ({
        path: `getting-started/${page.slug}`,
        title: 'Getting started · Rivinia Docs',
        data: { docsTitleKey: page.titleKey, docsStep },
        loadComponent: () =>
          import('./getting-started/docs-getting-started.component').then(
            (m) => m.DocsGettingStartedComponent,
          ),
      })),
      {
        path: 'http',
        data: { docsPackageId: 'http' },
        children: [
          {
            path: '',
            data: { docsTitleKey: 'docs.library', docsPackageId: 'http' },
            loadComponent: () =>
              import('./library-overview/docs-library-overview.component').then(
                (m) => m.DocsLibraryOverviewComponent,
              ),
          },
          ...['quick-start', 'guides', 'api', 'changelog'].map((section) => ({
            path: section,
            data: { docsTitleKey: 'docs.library', docsPackageId: 'http', section },
            loadComponent: () =>
              import('./library-overview/docs-library-overview.component').then(
                (m) => m.DocsLibraryOverviewComponent,
              ),
          })),
          {
            path: 'guides',
            data: { docsPackageId: 'http' },
            children: [
              ...[
                ['configuration', 'guides-configuration'],
                ['observables', 'guides-observables'],
                ['resources', 'guides-resources'],
                ['responses', 'guides-responses'],
                ['testing', 'guides-testing'],
              ].map(([path, section]) => ({
                path,
                data: { docsTitleKey: 'docs.library', docsPackageId: 'http', section },
                loadComponent: () =>
                  import('./library-overview/docs-library-overview.component').then(
                    (m) => m.DocsLibraryOverviewComponent,
                  ),
              })),
            ],
          },
        ],
      },
      {
        path: 'theme',
        data: { docsPackageId: 'theme' },
        children: [
          ...THEME_DOC_NAV.filter((page) => !page.section.includes('/')).map((page) => ({
            path: page.section,
            pathMatch: 'full' as const,
            data: { docsTitleKey: page.titleKey, docsPackageId: 'theme', section: page.section },
            loadComponent: () =>
              import('./library-overview/docs-library-overview.component').then(
                (m) => m.DocsLibraryOverviewComponent,
              ),
          })),
          {
            path: 'guides',
            data: { docsPackageId: 'theme' },
            children: THEME_DOC_NAV.filter((page) => page.section.startsWith('guides/')).map(
              (page) => ({
                path: page.section.split('/')[1],
                data: {
                  docsTitleKey: page.titleKey,
                  docsPackageId: 'theme',
                  section: page.section,
                },
                loadComponent: () =>
                  import('./library-overview/docs-library-overview.component').then(
                    (m) => m.DocsLibraryOverviewComponent,
                  ),
              }),
            ),
          },
        ],
      },
      {
        path: 'i18n',
        data: { docsPackageId: 'i18n' },
        children: I18N_DOC_NAV.map((page) => ({
          path: page.section,
          pathMatch: 'full',
          data: { docsTitleKey: page.titleKey, docsPackageId: 'i18n', section: page.section },
          loadComponent: () =>
            import('./library-overview/docs-library-overview.component').then(
              (m) => m.DocsLibraryOverviewComponent,
            ),
        })),
      },
      {
        path: ':package',
        data: { docsTitleKey: 'docs.library' },
        loadComponent: () =>
          import('./library-overview/docs-library-overview.component').then(
            (m) => m.DocsLibraryOverviewComponent,
          ),
      },
      {
        path: ':package/:section',
        title: 'Library · Rivinia Docs',
        data: { docsTitleKey: 'docs.library' },
        loadComponent: () =>
          import('./not-found/docs-not-found.component').then((m) => m.DocsNotFoundComponent),
      },
      {
        path: '**',
        title: 'Not found · Rivinia Docs',
        data: { docsTitleKey: 'docs.notFound.title' },
        loadComponent: () =>
          import('./not-found/docs-not-found.component').then((m) => m.DocsNotFoundComponent),
      },
    ],
  },
];
