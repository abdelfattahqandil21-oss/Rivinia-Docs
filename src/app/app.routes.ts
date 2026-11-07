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
    loadChildren: () => import('./features/docs/docs.routes').then((m) => m.DOCS_ROUTES),
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
