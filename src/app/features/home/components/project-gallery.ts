import { Component, computed, input, OnChanges, signal } from '@angular/core';
import { PortfolioProject } from '../models/portfolio.model';
import { PortfolioImage } from './portfolio-image';

@Component({
  selector: 'app-project-gallery',
  imports: [PortfolioImage],
  template: `
    <section class="gallery" [attr.aria-label]="'Galeri ' + project().name"
      (keydown.arrowleft)="navigate(-1, $event)" (keydown.arrowright)="navigate(1, $event)">
      <div class="gallery-image">
        <app-portfolio-image [src]="activeImage().src"
          [alt]="project().name + ' — ' + activeImage().caption" fit="contain" />
      </div>
      @if (images().length > 1) {
        <div class="gallery-controls">
          <div class="gallery-navigation">
          <button class="gallery-arrow previous" type="button" aria-label="Gambar sebelumnya" (click)="navigate(-1)">
            <span aria-hidden="true">←</span>
          </button>
          <div class="gallery-options" aria-label="Pilih gambar">
            @for (item of images(); track item.src; let i = $index) {
              <button class="gallery-dot" type="button" [attr.aria-pressed]="selectedIndex() === i"
                [attr.aria-label]="'Lihat gambar ' + (i + 1) + ': ' + item.caption"
                [title]="item.caption" (click)="selectedIndex.set(i)"><span aria-hidden="true"></span></button>
            }
          </div>
          <button class="gallery-arrow next" type="button" aria-label="Gambar berikutnya" (click)="navigate(1)">
            <span aria-hidden="true">→</span>
          </button>
          </div>
          <p aria-live="polite">Gambar {{ selectedIndex() + 1 }} / {{ images().length }} · {{ activeImage().caption }}</p>
        </div>
      }
    </section>
  `,
  styles: `
    :host { display:block; min-width:0; }
    .gallery-image { position:relative; aspect-ratio:1.8; background:var(--soft); overflow:hidden; border-radius:9px; }
    .gallery-controls { position:relative; padding:16px; background:#fff; border-block:1px solid var(--line); }
    .gallery-controls p { font-size:12px; color:var(--muted); margin:10px 0 0; text-align:center; }
    .gallery-navigation { display:flex; align-items:center; justify-content:center; gap:16px; }
    .gallery-options { display:flex; justify-content:center; flex-wrap:wrap; }
    .gallery-arrow { flex-shrink:0; width:44px; height:44px; display:grid; place-items:center; padding:0; border:1px solid #d2d4d8; border-radius:50%; background:var(--paper); color:var(--ink); box-shadow:0 2px 6px #0001; }
    .gallery-arrow span { font:24px/1 Arial,sans-serif; }
    .gallery-arrow:hover { background:var(--ink); color:white; }
    .gallery-arrow:focus-visible { outline-offset:-5px; }
    .gallery-dot { width:44px; height:44px; padding:0; display:grid; place-items:center; background:transparent; border-radius:50%; }
    .gallery-dot span { width:9px; height:9px; border-radius:50%; background:#a9afb8; }
    .gallery-dot[aria-pressed="true"] span { width:24px; border-radius:8px; background:var(--ink); }
    .gallery-dot:hover span { background:var(--accent); }
    @media (prefers-reduced-motion:no-preference) {
      .gallery-dot span { transition:width .2s ease, background-color .2s ease; }
    }
  `,
})
export class ProjectGallery implements OnChanges {
  readonly project = input.required<PortfolioProject>();
  protected readonly selectedIndex = signal(0);
  protected readonly images = computed(() => {
    const project = this.project();
    return project.images?.length ? project.images : [{ src: project.image, caption: 'Pratinjau proyek' }];
  });
  protected readonly activeImage = computed(() => this.images()[this.selectedIndex()] ?? this.images()[0]);

  ngOnChanges(): void {
    this.selectedIndex.set(0);
  }

  protected navigate(direction: number, event?: Event): void {
    if (this.images().length < 2) return;
    event?.preventDefault();
    this.selectedIndex.update(index => (index + direction + this.images().length) % this.images().length);
  }
}
