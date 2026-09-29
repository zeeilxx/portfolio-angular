import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar';
import { PageMotion } from './shared/components/page-motion';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, PageMotion],
  template: `
    <div id="top" appPageMotion>
      <a class="skip-link" href="#main-content">Lewati navigasi</a>
      <app-navbar />
      <main id="main-content" tabindex="-1"><router-outlet /></main>
    </div>
  `,
})
export class App {}
