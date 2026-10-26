import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <header class="site-header section-shell">
      <a class="brand" routerLink="/" aria-label="Portfolio, home">
        <!-- <span class="brand-mark" aria-hidden="true">p<span>·</span></span> -->
        <span>Ridhan Fadhlil Wafi</span></a
      >
      <nav aria-label="Main navigation">
        <a routerLink="/" fragment="about">Education</a>
        <a routerLink="/" fragment="experience">Experience</a>
        <a routerLink="/" fragment="work">Work</a>
        <a routerLink="/" fragment="skills">Skills</a>
        <a class="nav-contact" routerLink="/" fragment="contact"
          >Let us talk <span aria-hidden="true">↗</span></a
        >
      </nav>
    </header>
  `,
})
export class Navbar {}
