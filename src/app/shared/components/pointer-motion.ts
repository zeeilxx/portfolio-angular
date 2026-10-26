import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';

/** Decorative pointer effects; native links, focus and touch gestures remain available. */
@Directive({ selector: '[appPointerMotion]' })
export class PointerMotion {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => {
        if (typeof matchMedia === 'undefined') return;

        const root = this.host.nativeElement;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const precise = matchMedia('(hover: hover) and (pointer: fine)');
        const surfaceSelector =
          '.project-card, .certification-card, .portrait-frame, .contact-panel';
        let surface: HTMLElement | null = null;
        let magnet: HTMLElement | null = null;
        let hero: HTMLElement | null = null;
        let frame = 0;
        let latest: PointerEvent | null = null;

        const clearSurface = () => {
          if (!surface) return;
          surface.classList.remove('pointer-active');
          for (const key of ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y']) {
            surface.style.removeProperty(key);
          }
          surface = null;
        };
        const clearMagnet = () => {
          if (!magnet) return;
          magnet.style.removeProperty('--magnet-x');
          magnet.style.removeProperty('--magnet-y');
          magnet = null;
        };
        const clearHero = () => {
          if (!hero) return;
          hero.classList.remove('pointer-active');
          for (const key of ['--hero-x', '--hero-y', '--label-x', '--label-y']) {
            hero.style.removeProperty(key);
          }
          hero = null;
        };
        const reset = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          latest = null;
          clearSurface();
          clearMagnet();
          clearHero();
        };
        const render = () => {
          frame = 0;
          const event = latest;
          if (!event || reduced.matches || !precise.matches) return;
          // Hit-test again after scroll or DOM changes instead of keeping a stale target.
          const target = document.elementFromPoint(event.clientX, event.clientY);
          if (!target || !root.contains(target)) {
            reset();
            return;
          }

          const nextSurface = target.closest<HTMLElement>(surfaceSelector);
          if (nextSurface !== surface) {
            clearSurface();
            surface = nextSurface;
          }
          if (surface) {
            const bounds = surface.getBoundingClientRect();
            const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
            const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
            surface.style.setProperty('--pointer-x', `${x}px`);
            surface.style.setProperty('--pointer-y', `${y}px`);
            const depth = surface.matches('.portrait-frame') ? 5 : 2.2;
            surface.style.setProperty(
              '--tilt-x',
              `${(0.5 - y / Math.max(bounds.height, 1)) * depth}deg`,
            );
            surface.style.setProperty(
              '--tilt-y',
              `${(x / Math.max(bounds.width, 1) - 0.5) * depth}deg`,
            );
            surface.classList.add('pointer-active');
          }

          const nextMagnet = target.closest<HTMLElement>('.button, .nav-contact');
          if (nextMagnet !== magnet) {
            clearMagnet();
            magnet = nextMagnet;
          }
          if (magnet) {
            const bounds = magnet.getBoundingClientRect();
            const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
            const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
            magnet.style.setProperty('--magnet-x', `${Math.max(-7, Math.min(7, x))}px`);
            magnet.style.setProperty('--magnet-y', `${Math.max(-5, Math.min(5, y))}px`);
          }

          const nextHero = target.closest<HTMLElement>('.hero');
          if (nextHero !== hero) {
            clearHero();
            hero = nextHero;
          }
          if (hero) {
            const bounds = hero.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            hero.style.setProperty('--hero-x', `${x}px`);
            hero.style.setProperty('--hero-y', `${y}px`);
            hero.style.setProperty('--label-x', `${(x / Math.max(bounds.width, 1) - 0.5) * -18}px`);
            hero.style.setProperty(
              '--label-y',
              `${(y / Math.max(bounds.height, 1) - 0.5) * -14}px`,
            );
            hero.classList.add('pointer-active');
          }
        };
        const schedule = () => {
          if (latest && !frame) frame = requestAnimationFrame(render);
        };
        const onPointer = (event: PointerEvent) => {
          if (reduced.matches || !precise.matches || event.pointerType === 'touch') return;
          latest = event;
          schedule();
        };
        const onKey = (event: KeyboardEvent) => {
          if (event.key === 'Tab' || event.key === 'Escape') reset();
        };

        root.addEventListener('pointermove', onPointer, { passive: true });
        root.addEventListener('pointerleave', reset);
        root.addEventListener('pointercancel', reset);
        root.addEventListener('keydown', onKey);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('blur', reset);
        reduced.addEventListener('change', reset);
        precise.addEventListener('change', reset);

        this.destroyRef.onDestroy(() => {
          reset();
          root.removeEventListener('pointermove', onPointer);
          root.removeEventListener('pointerleave', reset);
          root.removeEventListener('pointercancel', reset);
          root.removeEventListener('keydown', onKey);
          window.removeEventListener('scroll', schedule);
          window.removeEventListener('blur', reset);
          reduced.removeEventListener('change', reset);
          precise.removeEventListener('change', reset);
        });
      }),
    );
  }
}
