import { Routes } from '@angular/router';

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
      import('./features/docs/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        title: 'Docs · Rivinia Docs',
        data: { docsTitleKey: 'page.docs.title' },
        loadComponent: () =>
          import('./features/docs/docs-hub.component').then((m) => m.DocsHubComponent),
      },
      {
        path: 'getting-started/:slug',
        title: 'Getting started · Rivinia Docs',
        data: { docsTitleKey: 'docs.start' },
        loadComponent: () =>
          import('./features/docs/docs-not-found.component').then((m) => m.DocsNotFoundComponent),
      },
      {
        path: ':package',
        title: 'Library · Rivinia Docs',
        data: { docsTitleKey: 'docs.library' },
        loadComponent: () =>
          import('./features/docs/docs-not-found.component').then((m) => m.DocsNotFoundComponent),
      },
      {
        path: ':package/:section',
        title: 'Library · Rivinia Docs',
        data: { docsTitleKey: 'docs.library' },
        loadComponent: () =>
          import('./features/docs/docs-not-found.component').then((m) => m.DocsNotFoundComponent),
      },
      {
        path: '**',
        title: 'Not found · Rivinia Docs',
        data: { docsTitleKey: 'docs.notFound.title' },
        loadComponent: () =>
          import('./features/docs/docs-not-found.component').then((m) => m.DocsNotFoundComponent),
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
