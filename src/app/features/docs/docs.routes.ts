import { Routes } from '@angular/router';

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
