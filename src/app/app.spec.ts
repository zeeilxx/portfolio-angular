import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should render the navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = fixture.nativeElement.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
    expect(Array.from(links, link => link.getAttribute('href'))).toEqual(['/', '/projects', '/contact']);
  });

  it('should load each feature and redirect unknown URLs to home', async () => {
    const harness = await RouterTestingHarness.create();
    for (const [url, heading] of [
      ['/', 'Portfolio'],
      ['/projects', 'Projects'],
      ['/contact', 'Contact'],
      ['/unknown', 'Portfolio'],
    ]) {
      await harness.navigateByUrl(url);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(heading);
    }
  });
});
