import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar';
import { PageMotion } from './shared/components/page-motion';
import { PointerMotion } from './shared/components/pointer-motion';
import { CursorTrail } from './shared/components/cursor-trail';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, PageMotion, PointerMotion, CursorTrail],
  template: `
    <div id="top" appPageMotion appPointerMotion appCursorTrail>
      <div class="scroll-progress" aria-hidden="true"></div>
      <a class="skip-link" href="#main-content">Skip navigation</a>
      <app-navbar />
      <main id="main-content" tabindex="-1"><router-outlet /></main>
      <a class="scroll-top" href="#top" aria-label="Back to top" title="Back to top" inert>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="m6 12 6-6 6 6M12 6v13" />
        </svg>
      </a>
    </div>
  `,
})
export class App {}
