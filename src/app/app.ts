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
      <div
        class="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-[linear-gradient(90deg,#202226,#8594ad,#202226)] [transform:scaleX(var(--scroll-progress,0))]"
        aria-hidden="true"
      ></div>
      <a
        class="skip-link fixed top-2 left-2 z-[100] -translate-y-[150%] bg-ink px-5 py-3 text-white focus:translate-y-0"
        href="#main-content"
        >Skip navigation</a
      >
      <app-navbar />
      <main id="main-content" tabindex="-1"><router-outlet /></main>
      <a
        class="scroll-top pointer-events-none invisible fixed right-7 bottom-7 z-40 grid size-[46px] place-items-center rounded-full border border-line bg-paper opacity-0 shadow-[0_6px_24px_#20222618] hover:bg-ink hover:text-white motion-safe:transition-[opacity,visibility,background,color,translate] motion-safe:duration-200 motion-safe:hover:-translate-y-1 max-[760px]:right-4 max-[760px]:bottom-4 max-[760px]:size-[42px] [&>svg]:size-[22px]"
        href="#top"
        aria-label="Back to top"
        title="Back to top"
        inert
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="m6 12 6-6 6 6M12 6v13" />
        </svg>
      </a>
    </div>
  `,
  styles: `
    .has-scrolled .scroll-top,
    .scroll-top:focus-visible {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
  `,
})
export class App {}
