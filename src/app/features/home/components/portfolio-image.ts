import { afterNextRender, Component, ElementRef, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-portfolio-image',
  host: { class: 'portfolio-image' },
  template: `
    @if (failedSrc() !== src()) {
      <img #imageElement [src]="src()" [alt]="alt()" [style.object-fit]="fit()" [loading]="priority() ? 'eager' : 'lazy'"
        decoding="async" [attr.fetchpriority]="priority() ? 'high' : 'auto'"
        (error)="failedSrc.set(src())" />
    } @else {
      <div class="image-placeholder" role="img" [attr.aria-label]="alt() + ' — gambar belum tersedia'">
        <span aria-hidden="true">+</span><strong>{{ alt() }}</strong><small>Gambar belum tersedia</small>
      </div>
    }
  `,
  styles: `
    :host { display:block; width:100%; height:100%; overflow:hidden; }
    img { width:100%; height:100%; object-fit:cover; display:block; }
    .image-placeholder { height:100%; padding:24px; background:#e2e4e7; color:#62666d; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; }
    .image-placeholder>span { font-size:38px; font-weight:300; }
    strong { font-size:14px; font-weight:500; }
    small { font-size:11px; }
  `,
})
export class PortfolioImage {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly priority = input(false);
  readonly fit = input<'cover' | 'contain'>('cover');
  private readonly imageElement = viewChild<ElementRef<HTMLImageElement>>('imageElement');

  constructor() {
    afterNextRender(() => {
      const image = this.imageElement()?.nativeElement;
      if (image?.complete && image.naturalWidth === 0) this.failedSrc.set(this.src());
    });
  }

  protected readonly failedSrc = signal<string | null>(null);
}
