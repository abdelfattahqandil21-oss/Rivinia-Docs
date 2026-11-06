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
    title: 'Docs · Rivinia',
    loadComponent: () =>
      import('./pages/docs/docs-page.component').then((m) => m.DocsPageComponent),
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
  {
    path: 'guides',
    title: 'Guides · Rivinia',
    loadComponent: () =>
      import('./pages/guides/guides-page.component').then((m) => m.GuidesPageComponent),
  },
  { path: '**', redirectTo: '' },
];
