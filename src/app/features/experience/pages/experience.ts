import { Component } from '@angular/core';
import { internships } from '../experience.data';
import { ExperienceAsset } from '../components/experience-asset';
import type { Internship } from '../models/experience.model';

@Component({
  selector: 'app-experience',
  imports: [ExperienceAsset],
  template: `
    <section
      id="experience"
      class="experience-section section-shell"
      aria-labelledby="experience-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">02 / PENGALAMAN KERJA</p>
          <h2 id="experience-title">Pengalaman <span class="serif-accent">kerja.</span></h2>
        </div>
        <p>Frontend & Fullstack Development<br />PT. Adira Dinamika Multi Finance</p>
      </div>
      <div class="experience-timeline">
        @for (experience of internships; track experience.id; let index = $index) {
          <article class="experience-entry" [attr.aria-labelledby]="experience.id + '-title'">
            <aside class="experience-meta">
              <span class="experience-index">0{{ index + 1 }} / INTERNSHIP</span>
              <p>{{ experience.period }}</p>
              <span class="internship-tag">Internship</span>
            </aside>
            <div class="experience-body">
              <div class="experience-title-row">
                <div>
                  <p class="eyebrow">{{ experience.team }}</p>
                  <h3 [id]="experience.id + '-title'">{{ experience.role }}</h3>
                  <p class="experience-company">{{ experience.organization }}</p>
                </div>
                <a
                  class="experience-website"
                  [href]="experience.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  [attr.aria-label]="'Kunjungi ' + experience.website + ' (tab baru)'"
                  >{{ experience.website }} ↗</a
                >
              </div>
              <p class="experience-summary">{{ experience.summary }}</p>
              <h3 class="experience-subtitle">Lingkup pekerjaan</h3>
              <ul class="responsibility-list">
                @for (responsibility of experience.responsibilities; track responsibility) {
                  <li>{{ responsibility }}</li>
                }
              </ul>
              <div class="experience-stack">
                @for (stack of experience.stacks; track stack.label) {
                  <div class="stack-row">
                    <h3>{{ stack.label }}</h3>
                    <div class="skill-tags">
                      @for (technology of stack.technologies; track technology) {
                        <span>{{ technology }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
              <div class="experience-evidence">
                <h3 class="experience-subtitle">Dokumentasi & sertifikat</h3>
                <div class="evidence-grid">
                  <app-experience-asset
                    [src]="experience.documentation ?? ''"
                    label="Dokumentasi"
                    [organization]="experience.organization"
                  />
                  <app-experience-asset
                    [src]="experience.certificate ?? ''"
                    label="Sertifikat internship"
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
