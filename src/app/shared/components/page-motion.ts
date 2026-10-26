import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';

/** Progressive enhancement: content stays visible without animation support. */
@Directive({ selector: '[appPageMotion]' })
export class PageMotion {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => {
        if (typeof IntersectionObserver === 'undefined' || typeof matchMedia === 'undefined')
          return;

        const root: HTMLElement = this.host.nativeElement;
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        const seen = new WeakSet<Element>();
        const animations = new Set<Animation>();
        const groupedAnimations = new WeakMap<HTMLElement, Set<Animation>>();
        const topLink = root.querySelector<HTMLAnchorElement>('.scroll-top');
        let navigation: { link: HTMLAnchorElement; section: HTMLElement }[] = [];
        let scrollFrame = 0;
        const selector =
          '.site-header, .hero-copy, .hero-visual, .expertise-strip, .education-grid, .section-heading, .experience-entry, .project-card, .organization-card, .certification-card, .skill-row, .contact-panel, .site-footer, .contact-details, app-projects h1, app-contact h1';
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const element = entry.target as HTMLElement;
              groupedAnimations.get(element)?.forEach((animation) => animation.cancel());
              element.toggleAttribute('data-motion-visible', entry.isIntersecting);
              if (!entry.isIntersecting) continue;
              if (
                preference.matches ||
                document.hidden ||
                !element.animate ||
                element.contains(document.activeElement)
              )
                continue;
              const siblings = element.parentElement?.children;
              const index = siblings ? Array.from(siblings).indexOf(element) : 0;
              let nested: NodeListOf<HTMLElement> | undefined;
              if (element.matches('.hero-copy'))
                nested = element.querySelectorAll(
                  '.eyebrow, .hero-title-line, .hero-intro, .hero-actions, .hero-note',
                );
              else if (element.matches('.section-heading'))
                nested = element.querySelectorAll('.eyebrow, h2, :scope > p');
              else if (element.matches('.skill-row'))
                nested = element.querySelectorAll('h3, .skill-badges li');
              const targets = nested?.length ? Array.from(nested) : [element];
              const group = new Set<Animation>();
              groupedAnimations.set(element, group);
              targets.forEach((target, position) => {
                const offset = element.matches('.skill-row') ? 12 : 26;
                const delay =
                  targets.length > 1
                    ? Math.min(position * (element.matches('.skill-row') ? 24 : 75), 340)
                    : Math.min(index % 3, 2) * 65;
                const animation = target.animate(
                  [
                    { opacity: 0, transform: `translateY(${offset}px)` },
                    { opacity: 1, transform: 'translateY(0)' },
                  ],
                  {
                    duration: 720,
                    delay,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'backwards',
                  },
                );
                animations.add(animation);
                group.add(animation);
                const release = () => {
                  animations.delete(animation);
                  group.delete(animation);
                };
                animation.onfinish = release;
                animation.oncancel = release;
              });
            }
          },
          { threshold: 0, rootMargin: '0px 0px -24px 0px' },
        );

        const updateScroll = () => {
          scrollFrame = 0;
          const distance = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          const progress = distance ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
          root.style.setProperty('--scroll-progress', progress.toFixed(4));
          const showTop = window.scrollY > window.innerHeight * 0.7;
          root.classList.toggle('has-scrolled', showTop);
          if (topLink) topLink.inert = !showTop && document.activeElement !== topLink;
          let current: HTMLAnchorElement | undefined;
          for (const { link, section } of navigation) {
            if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = link;
          }
          if (progress >= 0.999 && distance > 0) current = navigation.at(-1)?.link;
          for (const { link } of navigation) {
            const active = link === current;
            link.classList.toggle('is-current', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          }
        };
        const scheduleScroll = () => {
          if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
        };
        const register = () => {
          root.querySelectorAll(selector).forEach((element) => {
            if (seen.has(element)) return;
            seen.add(element);
            observer.observe(element);
          });
          navigation = Array.from(root.querySelectorAll<HTMLAnchorElement>('nav a')).flatMap(
            (link) => {
              const section = link.hash ? document.getElementById(link.hash.slice(1)) : null;
              if (!section) {
                link.classList.remove('is-current');
                link.removeAttribute('aria-current');
              }
              return section ? [{ link, section }] : [];
            },
          );
          scheduleScroll();
        };
        const mutations = new MutationObserver((records) => {
          for (const record of records) {
            record.removedNodes.forEach((node) => {
              // Hydration can move existing nodes within the same mutation batch.
              // Keep observing those nodes; only detach observers for real removals.
              if (!(node instanceof Element) || root.contains(node)) return;
              observer.unobserve(node);
              seen.delete(node);
              if (node instanceof HTMLElement)
                groupedAnimations.get(node)?.forEach((animation) => animation.cancel());
              node.querySelectorAll<HTMLElement>(selector).forEach((element) => {
                observer.unobserve(element);
                seen.delete(element);
                groupedAnimations.get(element)?.forEach((animation) => animation.cancel());
              });
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
        const resize =
          typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleScroll);
        const onVisibility = () => {
          if (document.hidden) cancelAnimations();
          else scheduleScroll();
        };
        register();
        resize?.observe(root);
        mutations.observe(root, { childList: true, subtree: true });
        preference.addEventListener('change', onPreferenceChange);
        root.addEventListener('focusin', cancelAnimations);
        root.addEventListener('focusout', scheduleScroll);
        window.addEventListener('scroll', scheduleScroll, { passive: true });
        window.addEventListener('resize', scheduleScroll, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);
        this.destroyRef.onDestroy(() => {
          observer.disconnect();
          mutations.disconnect();
          resize?.disconnect();
          cancelAnimationFrame(scrollFrame);
          cancelAnimations();
          preference.removeEventListener('change', onPreferenceChange);
          root.removeEventListener('focusin', cancelAnimations);
          root.removeEventListener('focusout', scheduleScroll);
          window.removeEventListener('scroll', scheduleScroll);
          window.removeEventListener('resize', scheduleScroll);
          document.removeEventListener('visibilitychange', onVisibility);
        });
      }),
    );
  }
}
