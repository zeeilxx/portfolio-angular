import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
  Scroll,
} from '@angular/router';

/** Preserve native startup scrolling and keep one stable record for SPA history. */
@Injectable({ providedIn: 'root' })
export class NavigationScroll {
  private readonly router = inject(Router);
  private readonly viewport = inject(ViewportScroller);
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private initialized = false;

  initialize(): void {
    const window = this.document.defaultView;
    if (this.initialized || !isPlatformBrowser(this.platform) || !window) return;
    this.initialized = true;
    this.viewport.setHistoryScrollRestoration('auto');

    const positions = new Map<number, [number, number]>();
    let lastPosition = this.viewport.getScrollPosition();
    let initialNavigationId: number | null = null;
    let currentId: number | null = null;
    let activeId: number | null = null;
    let restoredId: number | null = null;
    let navigating = false;

    const remember = () => {
      if (navigating) return;
      lastPosition = this.viewport.getScrollPosition();
      if (currentId !== null) positions.set(currentId, lastPosition);
    };
    const allowNativeRestore = () => this.viewport.setHistoryScrollRestoration('auto');
    window.addEventListener('scroll', remember, { passive: true });
    window.addEventListener('pagehide', allowNativeRestore);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', remember);
      window.removeEventListener('pagehide', allowNativeRestore);
      positions.clear();
    });

    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // SPA history has one owner; pagehide returns reload restoration to the browser.
        if (initialNavigationId !== null) this.viewport.setHistoryScrollRestoration('manual');
        if (currentId !== null) {
          // Native popstate restoration can precede Angular's NavigationStart.
          positions.set(
            currentId,
            event.navigationTrigger === 'imperative'
              ? this.viewport.getScrollPosition()
              : lastPosition,
          );
        }
        activeId = event.id;
        restoredId = event.restoredState?.navigationId ?? null;
        navigating = true;
        return;
      }
      if (event instanceof NavigationEnd) {
        currentId = activeId = event.id;
        if (initialNavigationId === null) {
          initialNavigationId = event.id;
          navigating = false;
          remember();
        }
        return;
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        activeId = currentId;
        navigating = false;
        remember();
        return;
      }
      if (event instanceof NavigationSkipped) {
        activeId = event.id;
        navigating = false;
        return;
      }
      if (
        !(event instanceof Scroll) ||
        initialNavigationId === null ||
        event.routerEvent.id === initialNavigationId ||
        event.routerEvent.id !== activeId
      ) {
        return;
      }

      if (event.scrollBehavior !== 'manual') {
        const position =
          restoredId === null ? event.position : (positions.get(restoredId) ?? event.position);
        if (position) {
          this.viewport.scrollToPosition(position, { behavior: 'instant' });
        } else if (restoredId === null) {
          if (event.anchor) this.viewport.scrollToAnchor(event.anchor);
          else this.viewport.scrollToPosition([0, 0], { behavior: 'instant' });
        }
      }
      navigating = false;
      remember();
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
