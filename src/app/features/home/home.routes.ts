import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    title: 'Portfolio',
    loadComponent: () => import('./pages/home').then(m => m.Home),
  },
];
