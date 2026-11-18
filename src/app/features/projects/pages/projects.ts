import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCard } from '../../home/components/project-card';
import { projects } from '../../home/portfolio.data';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, ProjectCard],
  host: { class: 'mx-auto my-[60px] block max-w-[1200px] px-8' },
  template: `
    <section aria-labelledby="projects-title">
      <a
        routerLink="/"
        class="experience-back mb-[50px] inline-block text-[11px] text-muted max-[760px]:mb-[35px]"
        >← Back to Home</a
      >
      <p
        class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
      >
        PROFESSIONAL & ACADEMIC PROJECTS
      </p>
      <h1
        class="mb-[27px] text-[clamp(46px,5.3vw,74px)] leading-[1.09] font-bold tracking-[-3.7px] max-[1000px]:text-[55px] max-[1000px]:tracking-[-2.7px] max-[760px]:text-[clamp(46px,9vw,66px)]"
        id="projects-title"
      >
        Projects
      </h1>
      <div
        class="project-grid grid grid-cols-2 gap-x-7 gap-y-[38px] max-[760px]:gap-x-[18px] max-[760px]:gap-y-[26px] max-[420px]:grid-cols-1"
      >
        @for (project of projects; track project.id) {
          <app-project-card [project]="project" [detailed]="true" />
        }
      </div>
    </section>
  `,
})
export class Projects {
  protected readonly projects = projects;
}
