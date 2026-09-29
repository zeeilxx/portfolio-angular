import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <header class="site-header section-shell">
      <a class="brand" routerLink="/" aria-label="Portfolio, beranda">
        <!-- <span class="brand-mark" aria-hidden="true">p<span>·</span></span> -->
        <span>Ridhan Fadhlil Wafi</span></a
      >
      <nav aria-label="Navigasi utama">
        <a routerLink="/" fragment="about">Pendidikan</a>
        <a routerLink="/" fragment="experience">Experience</a>
        <a routerLink="/" fragment="work">Karya</a>
        <a class="nav-contact" routerLink="/" fragment="contact"
          >Mari ngobrol <span aria-hidden="true">↗</span></a
        >
      </nav>
    </header>
  `,
})
export class Navbar {}
