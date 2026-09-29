import { Routes } from '@angular/router';

export const experienceRoutes: Routes = [
  {
    path: '',
    title: 'Experience — Ridhan Fadhlil Wafi',
    loadComponent: () => import('./pages/experience').then(m => m.Experience),
  },
];
