import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';

/** Connect entry midpoints with a progress line that follows the reading position. */
@Directive({ selector: '[appExperienceTimeline]' })
export class ExperienceTimeline {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => {
        const root: HTMLElement = this.host.nativeElement;
        const entries = Array.from(root.querySelectorAll<HTMLElement>('.experience-entry'));
        if (!entries.length || typeof matchMedia === 'undefined') return;

        const dots = entries.map((entry) => entry.querySelector<HTMLElement>('.experience-dot'));
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let measure = true;
        let centers: number[] = [];
        let start = 0;
        let length = 0;

        const update = () => {
          frame = 0;
          const rootTop = root.getBoundingClientRect().top;
          if (measure) {
            // Dots stay outside entrance animations; preserve subpixel alignment.
            centers = entries.map((entry, index) => {
              const bounds = (dots[index] ?? entry).getBoundingClientRect();
              return bounds.top + bounds.height / 2 - rootTop;
            });
            start = centers[0];
            length = Math.max(0, centers[centers.length - 1] - start);
            root.style.setProperty('--timeline-start', `${start}px`);
            root.style.setProperty('--timeline-length', `${length}px`);
            measure = false;
          }

          const header =
            Number.parseFloat(document.documentElement.style.getPropertyValue('--header-height')) ||
            0;
          const readingPosition = header + Math.max(0, window.innerHeight - header) / 2;
          const traveled = readingPosition - rootTop - start;
          const progress = reduced.matches ? 1 : Math.min(1, Math.max(0, traveled / (length || 1)));
          root.style.setProperty('--timeline-progress', progress.toFixed(4));
          dots.forEach((dot, index) => {
            dot?.toggleAttribute(
              'data-reached',
              reduced.matches || traveled >= centers[index] - start,
            );
          });
        };
        const schedule = () => {
          if (!frame && !document.hidden) frame = requestAnimationFrame(update);
        };
        const onResize = () => {
          measure = true;
          schedule();
        };
        const onScroll = () => {
          if (!reduced.matches) schedule();
        };
        const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
        resize?.observe(root);
        entries.forEach((entry) => resize?.observe(entry));
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        reduced.addEventListener('change', schedule);
        document.addEventListener('visibilitychange', schedule);
        schedule();

        this.destroyRef.onDestroy(() => {
          cancelAnimationFrame(frame);
          resize?.disconnect();
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onResize);
          reduced.removeEventListener('change', schedule);
          document.removeEventListener('visibilitychange', schedule);
          for (const property of ['--timeline-start', '--timeline-length', '--timeline-progress']) {
            root.style.removeProperty(property);
          }
        });
      }),
    );
  }
}
