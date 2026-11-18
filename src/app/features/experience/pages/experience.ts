import { Component } from '@angular/core';
import { internships } from '../experience.data';
import { ExperienceAsset } from '../components/experience-asset';
import { ExperienceTimeline } from '../components/experience-timeline';
import type { Internship } from '../models/experience.model';

@Component({
  selector: 'app-experience',
  imports: [ExperienceAsset, ExperienceTimeline],
  host: { class: 'block' },
  template: `
    <section
      id="experience"
      class="experience-section pt-20 max-[760px]:pt-[55px] section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="experience-title"
    >
      <div
        class="section-heading flex items-end justify-between gap-8 mb-10 max-[760px]:mb-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4 [&_.eyebrow]:mb-[13px] [&_.eyebrow]:text-muted [&>p]:mb-1 [&>p]:text-xs [&>p]:leading-[1.8] [&>p]:text-muted"
      >
        <div>
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            02 / WORK EXPERIENCE
          </p>
          <h2
            class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            id="experience-title"
          >
            Work <span class="serif-accent font-bold not-italic text-accent">experience.</span>
          </h2>
        </div>
        <p>Frontend & Fullstack Development<br />PT. Adira Dinamika Multi Finance</p>
      </div>
      <div class="experience-timeline relative" appExperienceTimeline>
        <div
          class="experience-track pointer-events-none absolute left-0 w-[2px] -translate-x-1/2 overflow-hidden rounded-full bg-line [top:var(--timeline-start,0px)] [height:var(--timeline-length,0px)]"
          aria-hidden="true"
        >
          <div
            class="experience-progress h-full w-full origin-top bg-accent [transform:scaleY(var(--timeline-progress,0))] motion-reduce:transform-none"
          ></div>
        </div>
        @for (experience of internships; track experience.id; let index = $index) {
          <article
            class="experience-entry relative grid grid-cols-[235px_minmax(0,1fr)] gap-[60px] border-b border-line py-[60px] max-[1000px]:grid-cols-[185px_minmax(0,1fr)] max-[1000px]:gap-[30px] max-[760px]:grid-cols-1 max-[760px]:gap-7 max-[760px]:py-[38px] max-[760px]:pl-[26px]"
            [attr.aria-labelledby]="experience.id + '-title'"
          >
            <span
              class="experience-dot pointer-events-none absolute top-1/2 left-0 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#aeb4be] bg-paper data-[reached]:border-accent data-[reached]:bg-accent data-[reached]:shadow-[0_0_0_5px_#525c6b14] motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-200"
              aria-hidden="true"
            ></span>
            <aside
              class="experience-meta self-center pl-[26px] max-[760px]:pl-0 [&_p]:my-[15px] [&_p]:text-xs [&_p]:leading-[1.8] max-[760px]:[&_p]:my-[10px]"
            >
              <span class="experience-index font-mono text-[10px] tracking-[1px] text-muted"
                >0{{ index + 1 }} / INTERNSHIP</span
              >
              <p>{{ experience.period }}</p>
              <span
                class="internship-tag inline-block rounded-[3px] border border-[#bdc4ce] px-[9px] py-[5px] text-[9px] text-accent"
                >Internship</span
              >
            </aside>
            <div class="experience-body">
              <div
                class="experience-title-row flex items-start justify-between gap-[25px] max-[1000px]:flex-col max-[1000px]:gap-[15px] [&_.eyebrow]:mb-3 [&_.eyebrow]:text-muted [&_h3]:text-[clamp(26px,2.6vw,35px)] [&_h3]:tracking-[-1px]"
              >
                <div>
                  <p
                    class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
                  >
                    {{ experience.team }}
                  </p>
                  <h3 [id]="experience.id + '-title'">{{ experience.role }}</h3>
                  <p class="experience-company mt-3 mb-0 text-[15px] font-medium">
                    {{ experience.organization }}
                  </p>
                </div>
                <a
                  class="experience-website rounded-[3px] border border-[#c4c9d1] px-3 py-[10px] text-[10px] whitespace-nowrap hover:bg-soft motion-safe:transition-[color,background-color,translate] motion-safe:duration-200"
                  [href]="experience.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  [attr.aria-label]="'Visit ' + experience.website + ' (new tab)'"
                  >{{ experience.website }} ↗</a
                >
              </div>
              <p
                class="experience-summary mt-6 mb-[30px] max-w-[690px] text-[13px] leading-[1.9] text-muted"
              >
                {{ experience.summary }}
              </p>
              <h3 class="experience-subtitle mb-[18px] text-[11px] font-[650] tracking-[.5px]">
                Responsibilities
              </h3>
              <ul
                class="responsibility-list mt-0 mb-7 list-none p-0 [&_li]:relative [&_li]:mb-[10px] [&_li]:pl-[22px] [&_li]:text-[13px] [&_li]:leading-[1.8] [&_li]:text-muted [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-accent [&_li]:before:content-['↗']"
              >
                @for (responsibility of experience.responsibilities; track responsibility) {
                  <li>{{ responsibility }}</li>
                }
              </ul>
              <div class="experience-stack grid gap-[15px] border-y border-line py-[22px]">
                @for (stack of experience.stacks; track stack.label) {
                  <div
                    class="stack-row grid grid-cols-[170px_1fr] items-center gap-3 max-[760px]:grid-cols-1 max-[760px]:gap-[9px] [&_h3]:m-0 [&_h3]:font-mono [&_h3]:text-[10px] [&_h3]:leading-[1.6] [&_h3]:text-muted"
                  >
                    <h3>{{ stack.label }}</h3>
                    <div
                      class="skill-tags flex flex-wrap gap-[6px] [&_span]:rounded-[4px] [&_span]:border [&_span]:border-[#cbd0d7] [&_span]:bg-[#eceef0] [&_span]:px-[9px] [&_span]:py-[6px] [&_span]:text-[9px] [&_span]:text-[#555d68]"
                    >
                      @for (technology of stack.technologies; track technology) {
                        <span>{{ technology }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
              <div class="experience-evidence mt-8">
                <h3 class="experience-subtitle mb-[18px] text-[11px] font-[650] tracking-[.5px]">
                  Documentation & certificates
                </h3>
                <div class="evidence-grid grid grid-cols-2 gap-5 max-[420px]:grid-cols-1">
                  <app-experience-asset
                    [src]="experience.documentation ?? ''"
                    label="Documentation"
                    [organization]="experience.organization"
                  />
                  <app-experience-asset
                    [src]="experience.certificate ?? ''"
                    label="Internship certificate"
                    [organization]="experience.organization"
                    [certificate]="true"
                  />
                </div>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class Experience {
  protected readonly internships: readonly Internship[] = internships;
}
