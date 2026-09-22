import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes),
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes),
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.routes').then(m => m.contactRoutes),
  },
  { path: '**', redirectTo: '' },
];
