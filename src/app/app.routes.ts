import { Routes } from '@angular/router';
import { GETTING_STARTED_PAGES } from './features/docs/getting-started/models/docs-getting-started.model';

export const routes: Routes = [
  {
    path: '',
    title: 'Rivinia Docs',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./features/docs/shell/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        title: 'Docs · Rivinia Docs',
        data: { docsTitleKey: 'page.docs.title' },
        loadComponent: () =>
          import('./features/docs/hub/docs-hub.component').then((m) => m.DocsHubComponent),
      },
      ...GETTING_STARTED_PAGES.map((page, docsStep) => ({
        path: `getting-started/${page.slug}`,
        title: 'Getting started · Rivinia Docs',
        data: { docsTitleKey: page.titleKey, docsStep },
        loadComponent: () =>
          import('./features/docs/getting-started/docs-getting-started.component').then(
            (m) => m.DocsGettingStartedComponent,
          ),
      })),
      {
        path: ':package',
        data: { docsTitleKey: 'docs.library' },
        loadComponent: () =>
          import('./features/docs/library-overview/docs-library-overview.component').then(
            (m) => m.DocsLibraryOverviewComponent,
          ),
      },
      {
        path: ':package/:section',
        title: 'Library · Rivinia Docs',
        data: { docsTitleKey: 'docs.library' },
        loadComponent: () =>
          import('./features/docs/not-found/docs-not-found.component').then(
            (m) => m.DocsNotFoundComponent,
          ),
      },
      {
        path: '**',
        title: 'Not found · Rivinia Docs',
        data: { docsTitleKey: 'docs.notFound.title' },
        loadComponent: () =>
          import('./features/docs/not-found/docs-not-found.component').then(
            (m) => m.DocsNotFoundComponent,
          ),
      },
    ],
  },
  {
    path: 'components',
    title: 'Components · Rivinia',
    loadComponent: () =>
      import('./pages/components/components-page.component').then((m) => m.ComponentsPageComponent),
  },
  {
    path: 'playground',
    title: 'Playground · Rivinia',
    loadComponent: () =>
      import('./pages/playground/playground-page.component').then((m) => m.PlaygroundPageComponent),
  },
  { path: 'guides', redirectTo: 'docs' },
  { path: '**', redirectTo: '' },
];
