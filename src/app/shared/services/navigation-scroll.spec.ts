import { ViewportScroller } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationScroll } from './navigation-scroll';

describe('NavigationScroll', () => {
  let events: Subject<Event>;
  let viewport: {
    setHistoryScrollRestoration: ReturnType<typeof vi.fn>;
    getScrollPosition: ReturnType<typeof vi.fn>;
    scrollToPosition: ReturnType<typeof vi.fn>;
    scrollToAnchor: ReturnType<typeof vi.fn>;
  };
  const navigation = (id: number, url = '/') => new NavigationEnd(id, url, url);

  beforeEach(() => {
    events = new Subject<Event>();
    viewport = {
      setHistoryScrollRestoration: vi.fn(),
      getScrollPosition: vi.fn(() => [0, 0]),
      scrollToPosition: vi.fn(),
      scrollToAnchor: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { events: events.asObservable() } },
        { provide: ViewportScroller, useValue: viewport },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
  });

  it('preserves scrolling before initial navigation finishes, including refreshed fragments', () => {
    const service = TestBed.inject(NavigationScroll);
    service.initialize();
    service.initialize();
    const initial = navigation(1, '/#experience');
    events.next(initial);
    events.next(new Scroll(initial, null, 'experience'));
    events.next(new Scroll(initial, [0, 0], null));
    expect(viewport.setHistoryScrollRestoration).toHaveBeenCalledExactlyOnceWith('auto');
    expect(viewport.scrollToPosition).not.toHaveBeenCalled();
    expect(viewport.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('handles the next anchor even when Angular emits no initial Scroll during hydration', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    const next = navigation(2, '/#about');
    events.next(next);
    events.next(new Scroll(next, null, 'about'));
    expect(viewport.scrollToAnchor).toHaveBeenCalledExactlyOnceWith('about');
  });

  it('restores Back/Forward positions immediately after subsequent navigation', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    const next = navigation(2, '/projects');
    events.next(next);
    events.next(new Scroll(next, [0, 940], null));
    expect(viewport.scrollToPosition).toHaveBeenCalledExactlyOnceWith([0, 940], {
      behavior: 'instant',
    });
  });

  it('starts a newly selected page at the top', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    const next = navigation(2, '/contact');
    events.next(next);
    events.next(new Scroll(next, null, null));
    expect(viewport.scrollToPosition).toHaveBeenCalledExactlyOnceWith([0, 0], {
      behavior: 'instant',
    });
  });

  it('honors navigation that explicitly requests manual scrolling', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    const next = navigation(2, '/#work');
    events.next(next);
    events.next(new Scroll(next, null, 'work', 'manual'));
    expect(viewport.scrollToPosition).not.toHaveBeenCalled();
    expect(viewport.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('keeps Back/Forward positions when native restoration moves the viewport before Angular', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    viewport.getScrollPosition.mockReturnValue([0, 640]);
    window.dispatchEvent(new window.Event('scroll'));
    events.next(new NavigationStart(2, '/#work', 'imperative'));
    const work = navigation(2, '/#work');
    events.next(work);
    events.next(new Scroll(work, null, 'work'));
    viewport.getScrollPosition.mockReturnValue([0, 1800]);
    window.dispatchEvent(new window.Event('scroll'));

    events.next(new NavigationStart(3, '/', 'popstate', { navigationId: 1 }));
    viewport.getScrollPosition.mockReturnValue([0, 12]);
    window.dispatchEvent(new window.Event('scroll'));
    const back = navigation(3);
    events.next(back);
    events.next(new Scroll(back, [0, 12], null));
    expect(viewport.scrollToPosition).toHaveBeenLastCalledWith([0, 640], { behavior: 'instant' });

    viewport.getScrollPosition.mockReturnValue([0, 640]);
    window.dispatchEvent(new window.Event('scroll'));
    events.next(new NavigationStart(4, '/#work', 'popstate', { navigationId: 2 }));
    const forward = navigation(4, '/#work');
    events.next(forward);
    events.next(new Scroll(forward, [0, 12], null));
    expect(viewport.scrollToPosition).toHaveBeenLastCalledWith([0, 1800], { behavior: 'instant' });
  });

  it('ignores a delayed scroll from a navigation already superseded by another', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    events.next(new NavigationStart(2, '/contact', 'imperative'));
    const previous = navigation(2, '/contact');
    events.next(previous);
    events.next(new NavigationStart(3, '/projects', 'imperative'));
    events.next(new Scroll(previous, null, null));
    expect(viewport.scrollToPosition).not.toHaveBeenCalled();
  });

  it('does not access browser scroll behavior during server rendering', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    TestBed.inject(NavigationScroll).initialize();
    const initial = navigation(1);
    events.next(initial);
    events.next(new Scroll(initial, null, null));
    expect(viewport.setHistoryScrollRestoration).not.toHaveBeenCalled();
  });

  it('returns restoration to the browser before a refresh or leaving the document', () => {
    TestBed.inject(NavigationScroll).initialize();
    events.next(navigation(1));
    events.next(new NavigationStart(2, '/#about', 'imperative'));
    expect(viewport.setHistoryScrollRestoration).toHaveBeenLastCalledWith('manual');
    window.dispatchEvent(new window.Event('pagehide'));
    expect(viewport.setHistoryScrollRestoration).toHaveBeenLastCalledWith('auto');
  });
});
