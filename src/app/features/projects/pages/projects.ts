import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectGallery } from '../../home/components/project-gallery';
import { projects } from '../../home/portfolio.data';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, ProjectGallery],
  template: `
    <section aria-labelledby="projects-title">
      <a routerLink="/" class="experience-back">← Kembali ke Home</a>
      <p class="eyebrow">PROYEK PROFESIONAL & AKADEMIK</p><h1 id="projects-title">Projects</h1>
      <div class="project-grid">
        @for (project of projects; track project.id) {
          <article class="project-card">
            <app-project-gallery [project]="project" />
            <div class="project-info"><div><p class="project-category">{{ project.category }}@if (project.year) { · {{ project.year }}}</p><h2>{{ project.name }}</h2></div></div>
            <p class="project-description">{{ project.description }}</p>
            @if (project.url) {
              <p class="project-description"><a class="text-link" [href]="project.url" target="_blank" rel="noopener noreferrer">Kunjungi {{ project.name }} ↗</a></p>
            }
            <div class="skill-tags">@for (tag of project.tags; track tag) { <span>{{ tag }}</span> }</div>
          </article>
        }
      </div>
    </section>
  `,
})
export class Projects {
  protected readonly projects = projects;
}
