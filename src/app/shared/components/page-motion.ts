import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';

interface RevealGroup {
  element: HTMLElement;
  stagger: number;
  distance: number;
  nextStart: number;
}

interface RevealItem {
  element: HTMLElement;
  group: RevealGroup;
  order: number;
  opacity: string;
  translate: string;
  overflowAnchor: string;
  finalOpacity: number;
  state: 'pending' | 'running' | 'visible';
  animation: Animation | null;
}

/** Reveal visible content in reading order without moving its layout or timeline anchors. */
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
        const items = new Map<HTMLElement, RevealItem>();
        const groups = new Map<HTMLElement, RevealGroup>();
        const topLink = root.querySelector<HTMLAnchorElement>('.scroll-top');
        let navigation: { link: HTMLAnchorElement; section: HTMLElement }[] = [];
        let scrollFrame = 0;
        let registerFrame = 0;
        let destroyed = false;

        const definitions = [
          {
            name: 'hero',
            selector: '.hero-copy',
            children:
              ':scope > .eyebrow, .hero-title-line, :scope > .hero-intro, .hero-actions > a, :scope > .hero-note',
            stagger: 85,
            distance: 18,
          },
          { name: 'portrait', selector: '.hero-visual', children: '', stagger: 0, distance: 22 },
          {
            name: 'expertise',
            selector: '.expertise-strip',
            children: '.strip-inner > *',
            stagger: 45,
            distance: 12,
          },
          {
            name: 'education',
            selector: '.education-grid',
            children:
              ':scope > div:first-child > .eyebrow, :scope > div:first-child > h2, :scope > .about-copy > *',
            stagger: 90,
            distance: 18,
          },
          {
            name: 'heading',
            selector: '.section-heading',
            children: '.eyebrow, h2, :scope > p',
            stagger: 85,
            distance: 16,
          },
          {
            name: 'experience',
            selector: '.experience-entry',
            children:
              '.experience-meta > *, .experience-title-row > div > *, .experience-website, .experience-summary, .experience-subtitle, .responsibility-list > li, .stack-row, .evidence-grid > *',
            stagger: 80,
            distance: 16,
          },
          {
            name: 'projects',
            selector: '.project-grid',
            children: ':scope > app-project-card',
            stagger: 100,
            distance: 22,
          },
          {
            name: 'organizations',
            selector: '.organization-list',
            children: ':scope > .organization-card',
            stagger: 100,
            distance: 18,
          },
          {
            name: 'certifications',
            selector: '.certification-grid',
            children: ':scope > .certification-card',
            stagger: 100,
            distance: 18,
          },
          {
            name: 'skills',
            selector: '.skill-row',
            children: ':scope > h3, .skill-badges > li',
            stagger: 40,
            distance: 12,
          },
          {
            name: 'contact',
            selector: '.contact-panel',
            children: ':scope > :not(.contact-spark)',
            stagger: 85,
            distance: 18,
          },
          {
            name: 'footer',
            selector: '.site-footer',
            children: ':scope > *',
            stagger: 65,
            distance: 12,
          },
          {
            name: 'page-heading',
            selector:
              'app-projects section[aria-labelledby="projects-title"], app-contact section[aria-labelledby="contact-page-title"]',
            children:
              ':scope > .experience-back, :scope > .eyebrow, :scope > h1, :scope > .project-description',
            stagger: 85,
            distance: 18,
          },
          {
            name: 'contact-details',
            selector: '.contact-details',
            children: ':scope > div',
            stagger: 80,
            distance: 16,
          },
        ];

        const restoreStyles = (item: RevealItem, keepAnchorExcluded = false) => {
          for (const [property, original] of [
            ['opacity', item.opacity],
            ['translate', item.translate],
          ]) {
            if (original) item.element.style.setProperty(property, original);
            else item.element.style.removeProperty(property);
          }
          if (!keepAnchorExcluded) {
            if (item.overflowAnchor) item.element.style.overflowAnchor = item.overflowAnchor;
            else item.element.style.removeProperty('overflow-anchor');
          }
        };
        const finish = (item: RevealItem) => {
          const animation = item.animation;
          item.animation = null;
          if (animation) {
            animation.onfinish = null;
            animation.oncancel = null;
            animation.cancel();
          }
          restoreStyles(item);
          item.state = 'visible';
          item.element.dataset['motionState'] = 'visible';
          observer.unobserve(item.element);
        };
        const play = (item: RevealItem, delay: number) => {
          if (item.state !== 'pending') return;
          observer.unobserve(item.element);
          item.group.element.setAttribute('data-motion-visible', '');
          if (
            preference.matches ||
            document.hidden ||
            item.element.contains(document.activeElement)
          ) {
            finish(item);
            return;
          }

          const animation = item.element.animate(
            [
              { opacity: 0, translate: `0 ${item.group.distance}px` },
              { opacity: item.finalOpacity, translate: item.translate || '0 0' },
            ],
            {
              duration: 850,
              delay,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'both',
            },
          );
          item.animation = animation;
          item.state = 'running';
          item.element.dataset['motionState'] = 'running';
          // WAAPI owns the temporary entrance; CSS retains hover and pointer transforms.
          restoreStyles(item, true);
          animation.onfinish = () => finish(item);
          animation.oncancel = () => finish(item);
        };
        const reveal = (ready: RevealItem[]) => {
          const batches = new Map<RevealGroup, RevealItem[]>();
          for (const item of ready) {
            if (item.state !== 'pending') continue;
            const batch = batches.get(item.group) ?? [];
            batch.push(item);
            batches.set(item.group, batch);
          }
          const now = performance.now();
          for (const [group, batch] of batches) {
            batch.sort((a, b) => a.order - b.order);
            const base = Math.min(140, Math.max(0, group.nextStart - now));
            const stagger = Math.min(group.stagger, (420 - base) / Math.max(1, batch.length - 1));
            batch.forEach((item, index) => play(item, base + index * stagger));
            group.nextStart = now + base + batch.length * stagger;
          }
        };
        const observer = new IntersectionObserver(
          (entries) => {
            const ready = entries.flatMap((entry) => {
              const item = items.get(entry.target as HTMLElement);
              return entry.isIntersecting && entry.intersectionRatio >= 0.12 && item ? [item] : [];
            });
            reveal(ready);
          },
          { threshold: [0, 0.12], rootMargin: '0px 0px -64px 0px' },
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
          registerFrame = 0;
          if (destroyed) return;
          const prepared: RevealItem[] = [];
          for (const definition of definitions) {
            for (const element of root.querySelectorAll<HTMLElement>(definition.selector)) {
              let group = groups.get(element);
              if (!group) {
                group = {
                  element,
                  stagger: definition.stagger,
                  distance: definition.distance,
                  nextStart: 0,
                };
                groups.set(element, group);
                element.dataset['motionGroup'] = definition.name;
              }
              const targets = definition.children
                ? Array.from(element.querySelectorAll<HTMLElement>(definition.children))
                : [element];
              targets.forEach((target, order) => {
                if (items.has(target) || !target.animate) return;
                const bounds = target.getBoundingClientRect();
                const visible =
                  preference.matches ||
                  document.hidden ||
                  // SSR content already on screen must stay visible during hydration.
                  bounds.top < window.innerHeight ||
                  target.contains(document.activeElement);
                const item: RevealItem = {
                  element: target,
                  group,
                  order,
                  opacity: target.style.getPropertyValue('opacity'),
                  translate: target.style.getPropertyValue('translate'),
                  overflowAnchor: target.style.getPropertyValue('overflow-anchor'),
                  finalOpacity: Number.parseFloat(getComputedStyle(target).opacity),
                  state: visible ? 'visible' : 'pending',
                  animation: null,
                };
                items.set(target, item);
                prepared.push(item);
              });
            }
          }
          // Read all target geometry before applying entrance styles.
          for (const item of prepared) {
            item.element.dataset['motionState'] = item.state;
            item.element.dataset['motionOrder'] = String(item.order);
            if (item.state === 'visible') continue;
            item.element.style.opacity = '0';
            item.element.style.translate = `0 ${item.group.distance}px`;
            // A translated item must not become the browser's reload/scroll anchor.
            item.element.style.overflowAnchor = 'none';
            observer.observe(item.element);
          }
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
        const mutations = new MutationObserver(() => {
          for (const [element, item] of items) {
            if (root.contains(element)) continue;
            finish(item);
            items.delete(element);
          }
          for (const element of groups.keys()) {
            if (!root.contains(element)) groups.delete(element);
          }
          if (!registerFrame) registerFrame = requestAnimationFrame(register);
        });
        const onPreferenceChange = () => {
          if (preference.matches) items.forEach(finish);
        };
        const onFocus = (event: FocusEvent) => {
          if (!(event.target instanceof Node)) return;
          for (const item of items.values()) {
            if (item.element.contains(event.target)) finish(item);
          }
        };
        const onVisibility = () => {
          if (document.hidden) {
            for (const item of items.values()) {
              if (item.state === 'running') finish(item);
            }
          } else {
            const ready = Array.from(items.values()).filter((item) => {
              if (item.state !== 'pending') return false;
              const bounds = item.element.getBoundingClientRect();
              return bounds.bottom > 0 && bounds.top < window.innerHeight - 64;
            });
            reveal(ready);
            scheduleScroll();
          }
        };
        const resize =
          typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleScroll);
        register();
        resize?.observe(root);
        mutations.observe(root, { childList: true, subtree: true });
        preference.addEventListener('change', onPreferenceChange);
        root.addEventListener('focusin', onFocus);
        root.addEventListener('focusout', scheduleScroll);
        window.addEventListener('scroll', scheduleScroll, { passive: true });
        window.addEventListener('resize', scheduleScroll, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);
        this.destroyRef.onDestroy(() => {
          destroyed = true;
          observer.disconnect();
          mutations.disconnect();
          resize?.disconnect();
          cancelAnimationFrame(scrollFrame);
          cancelAnimationFrame(registerFrame);
          items.forEach(finish);
          items.clear();
          groups.clear();
          preference.removeEventListener('change', onPreferenceChange);
          root.removeEventListener('focusin', onFocus);
          root.removeEventListener('focusout', scheduleScroll);
          window.removeEventListener('scroll', scheduleScroll);
          window.removeEventListener('resize', scheduleScroll);
          document.removeEventListener('visibilitychange', onVisibility);
        });
      }),
    );
  }
}
