import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    title: 'Projects – Ridhan Fadhlil Wafi',
    loadComponent: () => import('./pages/projects').then(m => m.Projects),
  },
];
