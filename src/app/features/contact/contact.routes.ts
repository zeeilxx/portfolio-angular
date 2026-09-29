import { Routes } from '@angular/router';

export const contactRoutes: Routes = [
  {
    path: '',
    title: 'Contact – Ridhan Fadhlil Wafi',
    loadComponent: () => import('./pages/contact').then(m => m.Contact),
  },
];
