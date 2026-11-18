import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-experience-asset',
  host: { class: 'block min-w-0' },
  template: `
    <button
      class="experience-asset block w-full bg-transparent p-0 text-left disabled:cursor-default disabled:opacity-100 motion-safe:transition-[translate,border-color] motion-safe:duration-250 motion-safe:enabled:hover:-translate-y-1"
      type="button"
      [disabled]="!ready() && !pdfUrl()"
      (click)="openPreview(preview)"
      [attr.aria-label]="'Enlarge ' + label() + ' ' + organization()"
    >
      <span
        class="asset-image relative block aspect-[1.65] overflow-hidden rounded-[4px] border border-[#d4d7dc] bg-[#e7e9ec] [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img[hidden]]:hidden"
      >
        @if (src() && !pdfUrl()) {
          <img
            #assetImage
            [src]="src()"
            [alt]="label() + ' internship ' + organization()"
            [hidden]="!ready()"
            decoding="async"
            (load)="ready.set(true)"
            (error)="ready.set(false)"
          />
        }
        @if (pdfUrl()) {
          <span
            class="asset-empty flex h-full flex-col items-center justify-center gap-[7px] text-xs text-muted [&_small]:text-[10px]"
            ><span class="asset-symbol mb-[3px] text-[30px] text-[#7a838f]" aria-hidden="true"
              >PDF</span
            >
            <span>{{ label() }}</span
            ><small>Click to view the certificate</small>
          </span>
        } @else if (!ready()) {
          <span
            class="asset-empty flex h-full flex-col items-center justify-center gap-[7px] text-xs text-muted [&_small]:text-[10px]"
            ><span class="asset-symbol mb-[3px] text-[30px] text-[#7a838f]" aria-hidden="true">{{
              certificate() ? '▤' : '▧'
            }}</span>
            <span>{{ label() }}</span
            ><small>Not yet available</small>
          </span>
        } @else {
          <span
            class="asset-expand absolute right-3 bottom-3 rounded-[3px] bg-paper px-3 py-2 text-[10px]"
            aria-hidden="true"
            >Enlarge ↗</span
          >
        }
      </span>
      <span class="asset-caption flex justify-between pt-3 text-[11px] font-medium"
        ><span>{{ label() }}</span
        ><span aria-hidden="true">{{ ready() || pdfUrl() ? '↗' : '—' }}</span></span
      >
    </button>
    <dialog
      #preview
      class="asset-dialog m-auto max-h-[92dvh] w-[min(1100px,calc(100%_-_32px))] rounded-[5px] border border-[#d4d7dc] bg-paper px-4 pt-[52px] pb-4 backdrop:bg-[#191c22cc] backdrop:backdrop-blur-[5px] [&>img]:block [&>img]:max-h-[78dvh] [&>img]:w-full [&>img]:object-contain [&_iframe]:block [&_iframe]:h-[70dvh] [&_iframe]:w-full [&_iframe]:border-0"
      [attr.aria-label]="label() + ' ' + organization()"
      (click)="closeBackdrop($event, preview)"
      (close)="previewOpen.set(false)"
    >
      <button
        type="button"
        class="dialog-close absolute top-[15px] right-[15px] z-[1] size-10 rounded-full bg-paper motion-safe:transition-[transform,background-color] motion-safe:duration-200 motion-safe:hover:rotate-[8deg]"
        (click)="preview.close()"
        aria-label="Close preview"
        autofocus
      >
        ✕
      </button>
      @if (pdfUrl(); as pdf) {
        @if (previewOpen()) {
          <p class="pdf-help mb-4 text-xs leading-[1.6] [&_a]:underline">
            If the preview does not appear,
            <a [href]="src()" target="_blank" rel="noopener noreferrer"
              >open the PDF in a new tab ↗</a
            >.
          </p>
          <iframe [src]="pdf" [title]="label() + ' ' + organization()"></iframe>
        }
      } @else if (ready()) {
        <img [src]="src()" [alt]="label() + ' internship ' + organization()" />
      }
    </dialog>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .experience-asset {
      display: block;
      padding: 0;
      background: transparent;
      text-align: left;
      width: 100%;
    }
    .experience-asset:disabled {
      cursor: default;
      opacity: 1;
      color: inherit;
    }
    .asset-image {
      display: block;
      aspect-ratio: 1.65;
      background: #e7e9ec;
      border: 1px solid #d4d7dc;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
    }
    .asset-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    img[hidden] {
      display: none;
    }
    .asset-empty {
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      color: #62666d;
      font-size: 12px;
    }
    .asset-symbol {
      font-size: 30px;
      color: #7a838f;
      margin-bottom: 3px;
    }
    .asset-empty small {
      font-size: 10px;
    }
    .asset-caption {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 500;
      padding-top: 12px;
    }
    .asset-expand {
      position: absolute;
      right: 12px;
      bottom: 12px;
      background: #f4f4f5;
      padding: 8px 12px;
      font-size: 10px;
      border-radius: 3px;
    }
    .asset-dialog {
      width: min(1100px, calc(100% - 32px));
      max-height: 92dvh;
      padding: 52px 16px 16px;
      margin: auto;
      border: 1px solid #d4d7dc;
      background: #f4f4f5;
      border-radius: 5px;
    }
    .asset-dialog::backdrop {
      background: #191c22cc;
      backdrop-filter: blur(5px);
    }
    .asset-dialog > img {
      display: block;
      width: 100%;
      max-height: 78dvh;
      object-fit: contain;
    }
    iframe {
      display: block;
      width: 100%;
      height: 70dvh;
      border: 0;
    }
    .pdf-help {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .pdf-help a {
      text-decoration: underline;
    }
  `,
})
export class ExperienceAsset {
  readonly src = input.required<string>();
  readonly label = input.required<string>();
  readonly organization = input.required<string>();
  readonly certificate = input(false);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly pdfUrl = computed(() => {
    const path = this.src();
    // Only local experience PDFs supplied by portfolio data may be embedded.
    if (
      !path.startsWith('/images/experience/') ||
      !path.toLowerCase().endsWith('.pdf') ||
      path.includes('..') ||
      path.includes('\\')
    )
      return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(path));
  });
  protected readonly previewOpen = signal(false);
  protected readonly ready = signal(false);
  private readonly assetImage = viewChild<ElementRef<HTMLImageElement>>('assetImage');

  constructor() {
    afterNextRender(() => {
      const image = this.assetImage()?.nativeElement;
      if (image?.complete && image.naturalWidth > 0) this.ready.set(true);
    });
  }

  protected openPreview(dialog: HTMLDialogElement): void {
    this.previewOpen.set(true);
    dialog.showModal();
  }

  protected closeBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) dialog.close();
  }
}
