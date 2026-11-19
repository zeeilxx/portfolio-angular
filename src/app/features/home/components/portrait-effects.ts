import { Component } from '@angular/core';

/** A small, deterministic field of decorative objects in the portrait's 3D scene. */
@Component({
  selector: 'app-portrait-effects',
  host: {
    class: 'pointer-events-none absolute inset-0',
    'aria-hidden': 'true',
  },
  template: `
    <div class="effects-field absolute inset-0">
      <div class="effect-object cube-near">
        <div class="glass-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="effect-object cube-far">
        <div class="glass-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="effect-object shard-upper"><span class="glass-shard"></span></div>
      <div class="effect-object shard-lower"><span class="glass-shard"></span></div>
      <div class="effect-object streak-left"><span class="light-streak"></span></div>
      <div class="effect-object streak-top"><span class="light-streak"></span></div>
      @for (mote of motes; track $index) {
        <span
          class="effect-object light-mote"
          [style.left.%]="mote.x"
          [style.top.%]="mote.y"
          [style.--depth]="mote.depth + 'px'"
          [style.--delay]="mote.delay + 's'"
        ></span>
      }
    </div>
  `,
  styles: `
    :host,
    .effects-field,
    .effect-object,
    .glass-cube {
      transform-style: preserve-3d;
    }
    .effects-field {
      transform: translate3d(calc(var(--portrait-x, 0) * 7px), calc(var(--portrait-y, 0) * 7px), 0);
      transition: transform 0.35s ease;
    }
    .effect-object {
      position: absolute;
      transform: translate3d(0, 0, var(--depth));
      animation-name: effect-drift;
      animation-duration: 7s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-delay: var(--delay, 0s);
      animation-play-state: var(--portrait-motion, running);
    }
    .cube-near {
      --cube-size: clamp(18px, 2vw, 28px);
      --depth: 65px;
      --delay: -2s;
      top: 7%;
      right: 3%;
      width: var(--cube-size);
      height: var(--cube-size);
    }
    .cube-far {
      --cube-size: clamp(14px, 1.6vw, 22px);
      --depth: 45px;
      --delay: -5s;
      bottom: 9%;
      left: 1%;
      width: var(--cube-size);
      height: var(--cube-size);
    }
    .glass-cube {
      width: 100%;
      height: 100%;
      animation-name: glass-tumble;
      animation-duration: 18s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-play-state: var(--portrait-motion, running);
    }
    .cube-far .glass-cube {
      animation-direction: reverse;
      animation-delay: -7s;
    }
    .glass-cube i {
      position: absolute;
      inset: 0;
      border: 1px solid color-mix(in srgb, var(--accent) 65%, transparent);
      background: linear-gradient(135deg, #ffffff85, #ffffff08 70%);
    }
    .glass-cube i:nth-child(1) {
      transform: translateZ(calc(var(--cube-size) / 2));
    }
    .glass-cube i:nth-child(2) {
      transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2));
    }
    .glass-cube i:nth-child(3) {
      transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2));
    }
    .glass-cube i:nth-child(4) {
      transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2));
    }
    .glass-cube i:nth-child(5) {
      transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2));
    }
    .glass-cube i:nth-child(6) {
      transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2));
    }
    .shard-upper {
      --depth: 35px;
      --delay: -4s;
      top: -2%;
      left: 6%;
    }
    .shard-lower {
      --depth: 75px;
      --delay: -1s;
      right: 7%;
      bottom: -2%;
    }
    .glass-shard {
      display: block;
      width: clamp(16px, 2vw, 26px);
      height: 46px;
      border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
      background: linear-gradient(135deg, #ffffffbb, #a0a6b025 48%, #ffffff70 50%, #ffffff10);
      transform: rotateX(20deg) rotateY(-30deg) rotateZ(28deg);
    }
    .shard-lower .glass-shard {
      height: 36px;
      transform: rotateX(-25deg) rotateY(35deg) rotateZ(-25deg);
    }
    .streak-left {
      --depth: 48px;
      --delay: -1s;
      top: 37%;
      left: 1%;
    }
    .streak-top {
      --depth: 30px;
      --delay: -4s;
      top: 1%;
      left: 55%;
      rotate: 90deg;
    }
    .light-streak {
      display: block;
      width: 2px;
      height: 64px;
      background: linear-gradient(transparent, var(--accent), #fff, transparent);
      box-shadow: 0 0 9px #ffffff80;
      transform: rotateY(25deg) rotateZ(12deg);
    }
    .light-mote {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow:
        0 0 0 2px #ffffff90,
        0 0 9px #a0a6b060;
    }
    @keyframes effect-drift {
      0%,
      100% {
        transform: translate3d(-2px, 7px, calc(var(--depth) - 14px));
      }
      50% {
        transform: translate3d(3px, -8px, calc(var(--depth) + 14px));
      }
    }
    @keyframes glass-tumble {
      from {
        transform: rotateX(22deg) rotateY(30deg) rotateZ(12deg);
      }
      to {
        transform: rotateX(382deg) rotateY(390deg) rotateZ(12deg);
      }
    }
    @media (width < 760px) {
      .effects-field {
        transform: translateZ(-10px);
      }
      .glass-shard {
        height: 32px;
      }
      .light-streak {
        height: 44px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        display: none;
      }
      .effect-object,
      .glass-cube {
        animation-name: none;
      }
    }
  `,
})
export class PortraitEffects {
  protected readonly motes = [
    { x: 1, y: 18, depth: 55, delay: -1 },
    { x: 2, y: 65, depth: 70, delay: -4 },
    { x: 16, y: 99, depth: 35, delay: -2 },
    { x: 55, y: 101, depth: 60, delay: -5 },
    { x: 78, y: 0, depth: 45, delay: -3 },
    { x: 98, y: 28, depth: 60, delay: -6 },
    { x: 99, y: 68, depth: 40, delay: -2.5 },
    { x: 88, y: 96, depth: -20, delay: -4.5 },
  ];
}
