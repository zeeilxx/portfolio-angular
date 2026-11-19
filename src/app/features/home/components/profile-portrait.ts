import { afterNextRender, Component, DestroyRef, ElementRef, inject, input } from '@angular/core';
import { PortfolioImage } from './portfolio-image';
import { PortraitEffects } from './portrait-effects';

@Component({
  selector: 'app-profile-portrait',
  imports: [PortfolioImage, PortraitEffects],
  host: { class: 'block' },
  template: `
    <div
      class="portrait-scene relative h-[470px] max-[1000px]:h-[415px] max-[760px]:h-[430px] max-[420px]:h-[390px]"
    >
      <div class="portrait-float relative h-full">
        <div class="portrait-depth relative h-full">
          <div class="portrait-backplate absolute inset-0 rounded-[6px]" aria-hidden="true"></div>
          <div class="portrait-midplate absolute inset-0 rounded-[6px]" aria-hidden="true"></div>
          <div class="portrait-frame relative h-full overflow-hidden rounded-[6px] bg-soft">
            <app-portfolio-image
              src="/images/Profile.jpg"
              [alt]="'Portrait of ' + name()"
              [priority]="true"
            />
            <div
              class="portrait-light pointer-events-none absolute inset-0"
              aria-hidden="true"
            ></div>
          </div>
          <div
            class="portrait-corners pointer-events-none absolute -inset-[9px]"
            aria-hidden="true"
          >
            <span></span><span></span><span></span><span></span>
          </div>
          <app-portrait-effects />
        </div>
      </div>
    </div>
  `,
  styles: `
    .portrait-scene {
      perspective: 1100px;
    }
    .portrait-float,
    .portrait-depth {
      transform-style: preserve-3d;
    }
    .portrait-float {
      animation-name: portrait-float;
      animation-duration: 8s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-play-state: var(--portrait-motion, running);
    }
    .portrait-depth {
      transform: rotateX(var(--tilt-x, -2deg)) rotateY(var(--tilt-y, -4deg));
      transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .portrait-scene.pointer-active .portrait-depth {
      transition-duration: 0.18s;
    }
    .portrait-backplate,
    .portrait-midplate {
      pointer-events: none;
      border: 1px solid var(--accent);
    }
    .portrait-backplate {
      background: linear-gradient(140deg, var(--soft), var(--paper));
      transform: translate3d(15px, 18px, -38px);
      box-shadow: 8px 18px 28px -18px color-mix(in srgb, var(--ink) 30%, transparent);
    }
    .portrait-midplate {
      background: var(--soft);
      border-color: color-mix(in srgb, var(--accent) 55%, var(--paper));
      transform: translate3d(7px, 9px, -18px);
    }
    .portrait-frame {
      transform: translateZ(0);
      box-shadow:
        calc(12px - var(--portrait-x, 0) * 8px) calc(20px - var(--portrait-y, 0) * 8px) 36px -16px
          color-mix(in srgb, var(--ink) 30%, transparent),
        0 2px 5px color-mix(in srgb, var(--ink) 12%, transparent);
      transition: box-shadow 0.4s ease;
    }
    .portrait-frame::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid #ffffff66;
      border-radius: inherit;
      box-shadow: inset 0 0 0 1px #2022260a;
      pointer-events: none;
    }
    app-portfolio-image {
      transform: scale(1.035)
        translate(calc(var(--portrait-x, 0) * -1%), calc(var(--portrait-y, 0) * -1%));
      transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .portrait-scene.pointer-active app-portfolio-image {
      transition-duration: 0.25s;
    }
    .portrait-light {
      background:
        radial-gradient(
          ellipse at var(--pointer-x, 30%) var(--pointer-y, 15%),
          #ffffff38,
          transparent 65%
        ),
        linear-gradient(115deg, #ffffff10 10%, transparent 45%, #2022260a);
      opacity: 0.35;
      transition: opacity 0.4s ease;
    }
    .portrait-scene.pointer-active .portrait-light {
      opacity: 0.85;
    }
    .portrait-corners {
      transform: translate3d(
        calc(var(--portrait-x, 0) * 4px),
        calc(var(--portrait-y, 0) * 4px),
        30px
      );
      transition: transform 0.35s ease;
    }
    .portrait-corners span {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: var(--accent);
      border-style: solid;
      border-width: 0;
      opacity: 0.7;
    }
    .portrait-corners span:nth-child(1) {
      top: 0;
      left: 0;
      border-top-width: 1px;
      border-left-width: 1px;
    }
    .portrait-corners span:nth-child(2) {
      top: 0;
      right: 0;
      border-top-width: 1px;
      border-right-width: 1px;
    }
    .portrait-corners span:nth-child(3) {
      bottom: 0;
      left: 0;
      border-bottom-width: 1px;
      border-left-width: 1px;
    }
    .portrait-corners span:nth-child(4) {
      bottom: 0;
      right: 0;
      border-bottom-width: 1px;
      border-right-width: 1px;
    }
    :host(.motion-paused) {
      --portrait-motion: paused;
    }
    @keyframes portrait-float {
      0%,
      100% {
        transform: translateY(0) rotateZ(-0.25deg);
      }
      50% {
        transform: translateY(-7px) rotateZ(0.25deg);
      }
    }
    @media (hover: none), (pointer: coarse) {
      .portrait-depth {
        transform: rotateX(-1deg) rotateY(-2deg);
      }
      .portrait-corners {
        transform: translateZ(10px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .portrait-float {
        animation-name: none;
      }
      .portrait-depth,
      .portrait-float,
      .portrait-corners,
      app-portfolio-image {
        transform: none;
        transition: none;
      }
      .portrait-light {
        display: none;
      }
    }
  `,
})
export class ProfilePortrait {
  readonly name = input.required<string>();
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement;
      let visible = true;
      const updateMotion = () => {
        element.classList.toggle('motion-paused', !visible || document.hidden);
      };
      const observer =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(([entry]) => {
              visible = entry.isIntersecting;
              updateMotion();
            });
      observer?.observe(element);
      updateMotion();
      document.addEventListener('visibilitychange', updateMotion);
      this.destroyRef.onDestroy(() => {
        observer?.disconnect();
        document.removeEventListener('visibilitychange', updateMotion);
      });
    });
  }
}
