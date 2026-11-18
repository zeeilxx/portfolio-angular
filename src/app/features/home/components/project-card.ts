import { Component, input, output } from '@angular/core';
import { PortfolioProject } from '../models/portfolio.model';
import { PortfolioImage } from './portfolio-image';
import { ProjectGallery } from './project-gallery';

@Component({
  selector: 'app-project-card',
  imports: [PortfolioImage, ProjectGallery],
  host: { class: 'block min-w-0' },
  template: `
    <article
      class="project-card relative h-full min-w-0 rounded-[16px] border border-[#dfe2e7] bg-white px-[14px] pt-[14px] pb-[22px] shadow-[0_4px_10px_#20222606,0_16px_36px_-12px_#20222626] focus-within:border-accent focus-within:shadow-[0_6px_14px_#2022260a,0_20px_42px_-12px_#20222633] hover:shadow-[0_6px_14px_#2022260a,0_20px_42px_-12px_#20222633] motion-safe:hover:-translate-y-1 motion-safe:hover:border-accent max-[760px]:rounded-[13px] max-[760px]:px-[10px] max-[760px]:pt-[10px] max-[760px]:pb-[18px]"
    >
      @if (detailed()) {
        <app-project-gallery [project]="project()" />
      } @else {
        <button
          class="project-preview group relative block aspect-[1.4] w-full overflow-hidden rounded-[9px] bg-soft p-0 text-left max-[760px]:aspect-square max-[420px]:aspect-[1.4]"
          type="button"
          (click)="projectSelected.emit(project())"
          [attr.aria-label]="'View details for ' + project().name"
        >
          <app-portfolio-image
            class="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.035]"
            [src]="project().image"
            [alt]="'Preview of ' + project().name"
          />
          <span
            class="preview-pill absolute right-5 bottom-5 flex gap-5 rounded-[4px] bg-paper px-[17px] py-[11px] text-[11px] shadow-[0_2px_8px_#0001] max-[760px]:right-[10px] max-[760px]:bottom-[10px] max-[760px]:gap-[10px] max-[760px]:px-[11px] max-[760px]:py-2 max-[760px]:text-[9px]"
          >
            View project <span class="text-[17px]" aria-hidden="true">↗</span>
          </span>
        </button>
      }
      <div
        class="project-info mx-[10px] mt-[17px] flex items-center justify-between max-[760px]:mx-[6px]"
      >
        <div>
          <p class="project-category mb-[5px] text-[10px] text-muted max-[760px]:text-[9px]">
            {{ project().category }}
            @if (detailed() && project().year) {
              · {{ project().year }}
            }
          </p>
          @if (detailed()) {
            <h2
              class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            >
              {{ project().name }}
            </h2>
          } @else {
            <h3 class="m-0 text-[21px] font-semibold tracking-[-.5px] max-[760px]:text-[18px]">
              <button
                class="bg-transparent p-0 hover:text-accent"
                type="button"
                (click)="projectSelected.emit(project())"
              >
                {{ project().name }}
              </button>
            </h3>
          }
        </div>
        @if (!detailed() && project().year) {
          <span class="font-mono text-[15px] text-muted">/ {{ project().year }}</span>
        }
      </div>
      @if (detailed()) {
        <p class="mx-[10px] my-5 text-[13px] leading-[1.9] text-muted max-[760px]:mx-[6px]">
          {{ project().description }}
        </p>
        @if (project().url) {
          <p class="mx-[10px] my-5 text-[13px] leading-[1.9] text-muted max-[760px]:mx-[6px]">
            <a
              class="border-b border-[#959ba4] py-2 text-xs motion-safe:transition-[color,background-color,translate] motion-safe:duration-200 motion-safe:hover:-translate-y-[2px]"
              [href]="project().url"
              target="_blank"
              rel="noopener noreferrer"
              >Visit {{ project().name }} ↗</a
            >
          </p>
        }
        <div class="mx-[10px] flex flex-wrap gap-[6px] max-[760px]:mx-[6px]">
          @for (tag of project().tags; track tag) {
            <span
              class="rounded-[4px] border border-[#cbd0d7] px-[9px] py-[6px] text-[9px] text-[#555d68]"
              >{{ tag }}</span
            >
          }
        </div>
      }
    </article>
  `,
  styles: `
    @media (prefers-reduced-motion: no-preference) {
      .project-card {
        transition:
          translate 0.25s ease,
          border-color 0.25s ease,
          box-shadow 0.25s ease;
      }
      @media (hover: hover) and (pointer: fine) {
        .project-card {
          transform: perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
          transition:
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            translate 0.25s,
            border-color 0.25s,
            box-shadow 0.25s;
        }
        .project-card.pointer-active {
          transition-duration: 0.14s;
        }
        .project-card::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(
            380px circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
            #9aafd229,
            transparent 75%
          );
          opacity: 0;
          transition: opacity 0.4s;
        }
        .project-card.pointer-active::after {
          opacity: 1;
        }
      }
    }
  `,
})
export class ProjectCard {
  readonly project = input.required<PortfolioProject>();
  readonly detailed = input(false);
  readonly projectSelected = output<PortfolioProject>();
}
