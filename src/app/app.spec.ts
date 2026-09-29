import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { projects } from './features/home/portfolio.data';

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
    expect(Array.from(links, link => link.getAttribute('href'))).toEqual(['/#about', '/#experience', '/#work', '/#contact']);
  });

  it('should load each feature and redirect unknown URLs to home', async () => {
    const harness = await RouterTestingHarness.create();
    for (const [url, heading] of [
      ['/', 'Membangun web.'],
      ['/projects', 'Projects'],
      ['/contact', 'Contact'],
      ['/experience', 'Membangun web.'],
      ['/unknown', 'Membangun web.'],
    ]) {
      await harness.navigateByUrl(url);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(heading);
    }
  });

  it('shows gallery controls in the Home modal and changes the selected image', async () => {
    const harness = await RouterTestingHarness.create('/');
    const root = harness.routeNativeElement!;
    const dialog = root.querySelector('.project-dialog') as HTMLDialogElement;
    // jsdom does not implement native modal opening.
    dialog.showModal = () => dialog.setAttribute('open', '');
    const open = root.querySelector('[aria-label="Lihat detail Dicicilaja.com"]') as HTMLButtonElement;
    open.click();
    harness.detectChanges();
    const project = projects.find(item => item.id === 'dicicilaja')!;
    const dots = dialog.querySelectorAll<HTMLButtonElement>('.gallery-dot');
    expect(dots.length).toBe(project.images!.length);
    expect(dots[0].getAttribute('aria-pressed')).toBe('true');
    (dialog.querySelector('.gallery-arrow.next') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(dots[1].getAttribute('aria-pressed')).toBe('true');
    expect(dialog.querySelector('app-portfolio-image img')?.getAttribute('src')).toBe(project.images![1].src);
    dots[2].click();
    harness.detectChanges();
    expect(dots[2].getAttribute('aria-pressed')).toBe('true');
    (dialog.querySelector('.gallery-arrow.next') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(dots[0].getAttribute('aria-pressed')).toBe('true');
  });
});
