import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

/** Progressive enhancement: content stays visible without animation support. */
@Directive({ selector: '[appPageMotion]' })
export class PageMotion {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined' || typeof matchMedia === 'undefined') return;

      const root: HTMLElement = this.host.nativeElement;
      const preference = matchMedia('(prefers-reduced-motion: reduce)');
      const seen = new WeakSet<Element>();
      const animations = new Set<Animation>();
      const activeAnimations = new WeakMap<Element, Animation>();
      const selector =
        '.site-header, .hero-copy, .hero-visual, .expertise-strip, .education-grid, .section-heading, .experience-entry, .project-card, .organization-card, .skill-card, .contact-panel, .site-footer, .contact-details, app-projects h1, app-contact h1';
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const element = entry.target as HTMLElement;
            activeAnimations.get(element)?.cancel();
            activeAnimations.delete(element);
            if (!entry.isIntersecting) continue;
            if (preference.matches || !element.animate || element.contains(document.activeElement))
              continue;
            const offset = entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) ? -18 : 18;
            const siblings = element.parentElement?.children;
            const index = siblings ? Array.from(siblings).indexOf(element) : 0;
            const animation = element.animate(
              [
                { opacity: 0, transform: `translateY(${offset}px)` },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: 520,
                delay: Math.min(index % 3, 2) * 65,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'backwards',
              },
            );
            animations.add(animation);
            activeAnimations.set(element, animation);
            const release = () => {
              animations.delete(animation);
              if (activeAnimations.get(element) === animation) activeAnimations.delete(element);
            };
            animation.onfinish = release;
            animation.oncancel = release;
          }
        },
        { threshold: 0, rootMargin: '0px 0px -24px 0px' },
      );

      const register = () => {
        root.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          observer.observe(element);
        });
      };
      const mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.removedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            observer.unobserve(node);
            node.querySelectorAll(selector).forEach((element) => observer.unobserve(element));
          });
        }
        register();
      });
      const cancelAnimations = () => {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      };
      const onPreferenceChange = () => {
        if (preference.matches) cancelAnimations();
      };
      register();
      mutations.observe(root, { childList: true, subtree: true });
      preference.addEventListener('change', onPreferenceChange);
      root.addEventListener('focusin', cancelAnimations);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        mutations.disconnect();
        cancelAnimations();
        preference.removeEventListener('change', onPreferenceChange);
        root.removeEventListener('focusin', cancelAnimations);
      });
    });
  }
}
