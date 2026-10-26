import { afterNextRender, DestroyRef, Directive, inject, NgZone } from '@angular/core';

interface CursorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
  turn: number;
  shape: number;
}

/** A viewport-wide decorative trail, independent of cards and page sections. */
@Directive({ selector: '[appCursorTrail]' })
export class CursorTrail {
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => {
        if (typeof matchMedia === 'undefined') return;

        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const precise = matchMedia('(hover: hover) and (pointer: fine)');
        const canvas = document.createElement('canvas');
        canvas.className = 'cursor-trail';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.setAttribute('popover', 'manual');
        let context: CanvasRenderingContext2D | null = null;
        let particles: CursorParticle[] = [];
        let frame = 0;
        let previousTime = 0;
        let lastMove = 0;
        let x = 0;
        let y = 0;
        let followX = 0;
        let followY = 0;
        let emittedX = 0;
        let emittedY = 0;
        let radius = 11;
        let sequence = 0;
        let present = false;
        let interactive = false;
        let light = false;
        let width = window.innerWidth;
        let height = window.innerHeight;
        const allowed = () => precise.matches && !reduced.matches && !document.hidden;

        const resize = () => {
          width = window.innerWidth;
          height = window.innerHeight;
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(width * ratio);
          canvas.height = Math.round(height * ratio);
          context?.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        const placeAboveDialogs = () => {
          // A manual popover is decorative and does not capture focus or clicks.
          // Reopen it after a dialog opens to keep the trail in the top layer.
          if (!present || !allowed() || !canvas.isConnected || !canvas.showPopover) return;
          if (canvas.matches(':popover-open')) canvas.hidePopover();
          canvas.showPopover();
        };
        const attach = () => {
          if (canvas.isConnected) return !!context;
          context = canvas.getContext('2d');
          if (!context) return false;
          // Browsers without popover support use the fixed canvas as a fallback.
          if (!canvas.showPopover) canvas.removeAttribute('popover');
          document.body.append(canvas);
          resize();
          return true;
        };
        const reset = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          previousTime = 0;
          present = false;
          particles = [];
          context?.clearRect(0, 0, width, height);
          if (canvas.isConnected && canvas.hidePopover && canvas.matches(':popover-open'))
            canvas.hidePopover();
        };
        const addParticle = (px: number, py: number, now: number, burst = false) => {
          const turn = sequence++ * 2.39996;
          const speed = burst ? 1.7 : 0.35;
          particles.push({
            x: px,
            y: py,
            vx: Math.cos(turn) * speed,
            vy: Math.sin(turn) * speed,
            born: now,
            life: burst ? 650 : 520,
            size: burst ? 4 : 2.5 + (sequence % 3),
            turn,
            shape: sequence % 3,
          });
          if (particles.length > 42) particles.shift();
        };
        const draw = (now: number) => {
          frame = 0;
          if (!context || !allowed() || !present) {
            reset();
            return;
          }
          const delta = Math.min(now - (previousTime || now - 16), 40);
          previousTime = now;
          const ease = 1 - Math.exp(-delta / 75);
          followX += (x - followX) * ease;
          followY += (y - followY) * ease;
          radius += ((interactive ? 19 : 11) - radius) * ease;

          const distance = Math.hypot(x - emittedX, y - emittedY);
          if (distance >= 9 && now - lastMove < 100) {
            const count = Math.min(5, Math.floor(distance / 9));
            for (let i = 1; i <= count; i++) {
              addParticle(
                emittedX + ((x - emittedX) * i) / count,
                emittedY + ((y - emittedY) * i) / count,
                now,
              );
            }
            emittedX = x;
            emittedY = y;
          }
          context.clearRect(0, 0, width, height);
          const ink = light ? '#d9e2f0' : '#53627a';
          const accent = light ? '#ead0a8' : '#9d7850';
          const opacity = Math.max(0, 1 - Math.max(0, now - lastMove - 650) / 650);

          // A rotating, open diamond follows slightly behind the native cursor.
          context.save();
          context.translate(followX, followY);
          context.rotate(now * 0.00065);
          context.globalAlpha = opacity * 0.8;
          context.strokeStyle = ink;
          context.lineWidth = 1;
          for (let corner = 0; corner < 4; corner++) {
            context.rotate(Math.PI / 2);
            context.beginPath();
            context.moveTo(-radius * 0.35, -radius);
            context.lineTo(0, -radius * 1.35);
            context.lineTo(radius * 0.35, -radius);
            context.stroke();
          }
          context.restore();

          particles = particles.filter((particle) => now - particle.born < particle.life);
          for (const particle of particles) {
            const age = (now - particle.born) / particle.life;
            particle.x += (particle.vx * delta) / 16;
            particle.y += (particle.vy * delta) / 16;
            context.save();
            context.globalAlpha = (1 - age) ** 2 * 0.7;
            context.strokeStyle = particle.shape === 1 ? accent : ink;
            context.lineWidth = 1;
            context.translate(particle.x, particle.y);
            context.rotate(particle.turn + age * 1.5);
            const size = particle.size * (1 - age * 0.5);
            context.beginPath();
            if (particle.shape === 0) {
              context.moveTo(0, -size);
              context.lineTo(size, 0);
              context.lineTo(0, size);
              context.lineTo(-size, 0);
              context.closePath();
            } else if (particle.shape === 1) {
              context.moveTo(-size, 0);
              context.lineTo(size, 0);
              context.moveTo(0, -size);
              context.lineTo(0, size);
            } else {
              context.arc(0, 0, size * 0.55, 0, Math.PI * 2);
            }
            context.stroke();
            context.restore();
          }
          if (opacity > 0 || particles.length) frame = requestAnimationFrame(draw);
          else reset(); // No animation loop remains running while the cursor rests.
        };
        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(draw);
        };
        const onMove = (event: PointerEvent) => {
          if (!allowed() || event.pointerType !== 'mouse' || !attach()) return;
          x = event.clientX;
          y = event.clientY;
          lastMove = performance.now();
          const target = event.target instanceof Element ? event.target : null;
          interactive = !!target?.closest(
            'a, button, input, textarea, select, summary, [role="button"]',
          );
          light = !!target?.closest('.contact-panel, .expertise-strip');
          if (!present) {
            followX = emittedX = x;
            followY = emittedY = y;
            radius = 11;
            present = true;
            placeAboveDialogs();
          }
          schedule();
        };
        const onDown = (event: PointerEvent) => {
          if (event.button !== 0) return;
          onMove(event);
          if (!present || !allowed() || event.pointerType !== 'mouse') return;
          for (let i = 0; i < 7; i++) addParticle(x, y, performance.now(), true);
          schedule();
        };
        const onLeave = (event: PointerEvent) => {
          if (!event.relatedTarget) reset();
        };
        const onKey = (event: KeyboardEvent) => {
          if (event.key === 'Tab' || event.key === 'Escape') reset();
        };
        const onToggle = (event: Event) => {
          if (event.target instanceof HTMLDialogElement) placeAboveDialogs();
        };

        document.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerdown', onDown, { passive: true });
        document.addEventListener('pointerout', onLeave);
        document.addEventListener('pointercancel', reset);
        document.addEventListener('keydown', onKey);
        document.addEventListener('visibilitychange', reset);
        document.addEventListener('toggle', onToggle, true);
        window.addEventListener('blur', reset);
        window.addEventListener('resize', resize, { passive: true });
        reduced.addEventListener('change', reset);
        precise.addEventListener('change', reset);
        this.destroyRef.onDestroy(() => {
          reset();
          canvas.remove();
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerdown', onDown);
          document.removeEventListener('pointerout', onLeave);
          document.removeEventListener('pointercancel', reset);
          document.removeEventListener('keydown', onKey);
          document.removeEventListener('visibilitychange', reset);
          document.removeEventListener('toggle', onToggle, true);
          window.removeEventListener('blur', reset);
          window.removeEventListener('resize', resize);
          reduced.removeEventListener('change', reset);
          precise.removeEventListener('change', reset);
        });
      }),
    );
  }
}
