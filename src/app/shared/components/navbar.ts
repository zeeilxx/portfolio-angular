import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Navigasi utama" class="flex flex-wrap gap-6 border-b border-slate-200 py-5">
      <a routerLink="/" routerLinkActive="font-bold" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page">Home</a>
      <a routerLink="/projects" routerLinkActive="font-bold" ariaCurrentWhenActive="page">Projects</a>
      <a routerLink="/contact" routerLinkActive="font-bold" ariaCurrentWhenActive="page">Contact</a>
    </nav>
  `,
})
export class Navbar {}
