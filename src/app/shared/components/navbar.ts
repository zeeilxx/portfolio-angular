import { DOCUMENT, ViewportScroller } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  host: {
    class:
      'sticky top-0 z-[80] block border-b border-line bg-paper shadow-[0_6px_24px_#20222608] supports-[backdrop-filter:blur(16px)]:bg-[color-mix(in_srgb,var(--paper)_90%,transparent)] supports-[backdrop-filter:blur(16px)]:backdrop-blur-[16px]',
  },
  template: `
    <!-- Resize the navbar here: min-h-[62px] and the mobile min-h-[126px]. -->
    <header
      class="site-header mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)] flex min-h-[62px] items-center justify-between max-[760px]:min-h-[126px] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:justify-center max-[760px]:gap-3 max-[760px]:py-[14px]"
    >
      <a
        class="brand flex w-fit items-center gap-3 text-[21px] font-[650] tracking-[-1px] max-[760px]:gap-2 max-[760px]:text-[18px]"
        routerLink="/"
        aria-label="Portfolio, home"
      >
        <span>Ridhan Fadhlil Wafi</span>
      </a>
      <nav
        class="flex items-center gap-9 text-[13px] font-medium max-[1000px]:gap-[22px] max-[760px]:justify-between max-[760px]:gap-3 max-[760px]:text-[11px] max-[420px]:gap-2 max-[420px]:text-[10px] max-[760px]:[&>a]:inline-flex max-[760px]:[&>a]:min-h-9 max-[760px]:[&>a]:items-center"
        aria-label="Main navigation"
      >
        <a routerLink="/" fragment="about">Education</a>
        <a routerLink="/" fragment="experience">Experience</a>
        <a routerLink="/" fragment="work">Work</a>
        <a routerLink="/" fragment="skills">Skills</a>
        <a
          class="nav-contact flex items-center gap-[23px] rounded-[5px] border border-[#bfc3c9] px-5 py-3 max-[760px]:gap-3 max-[760px]:px-[13px] max-[760px]:py-[10px] max-[420px]:gap-[5px] max-[420px]:p-[9px]"
          routerLink="/"
          fragment="contact"
        >
          Let us talk <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  `,
  styles: `
    nav a {
      position: relative;
    }
    nav a:hover {
      color: var(--accent);
    }
    nav a:not(.nav-contact)::after {
      content: '';
      position: absolute;
      inset: auto 0 -7px;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
    }
    nav a.is-current::after,
    nav a:hover::after {
      transform: scaleX(1);
    }
    nav a.is-current {
      color: var(--ink);
    }
    @media (prefers-reduced-motion: no-preference) {
      nav a {
        transition:
          color 0.2s ease,
          background-color 0.2s ease,
          translate 0.2s ease;
      }
      nav a::after {
        transition: transform 0.3s ease;
      }
      .nav-contact span {
        display: inline-block;
        transition: translate 0.2s ease;
      }
      @media (hover: hover) and (pointer: fine) {
        nav a:hover {
          translate: 0 -2px;
        }
        .nav-contact {
          translate: var(--magnet-x, 0px) var(--magnet-y, 0px);
          transition:
            translate 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.2s,
            transform 0.2s;
        }
        .nav-contact:hover {
          translate: var(--magnet-x, 0px) var(--magnet-y, 0px);
        }
        .nav-contact:hover span {
          translate: 2px -2px;
        }
      }
    }
  `,
})
export class Navbar {
  private readonly document = inject(DOCUMENT);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const root = this.document.documentElement;
      const previousHeight = root.style.getPropertyValue('--header-height');
      const updateHeight = () => {
        root.style.setProperty(
          '--header-height',
          `${this.host.nativeElement.getBoundingClientRect().height}px`,
        );
      };
      updateHeight();
      this.viewportScroller.setOffset(() => [
        0,
        this.host.nativeElement.getBoundingClientRect().height + 24,
      ]);
      const resize =
        typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateHeight);
      resize?.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => {
        resize?.disconnect();
        this.viewportScroller.setOffset([0, 0]);
        if (previousHeight) root.style.setProperty('--header-height', previousHeight);
        else root.style.removeProperty('--header-height');
      });
    });
  }
}
