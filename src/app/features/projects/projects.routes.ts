import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    title: 'Projects',
    loadComponent: () => import('./pages/projects').then(m => m.Projects),
  },
];
