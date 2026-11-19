import { Component, signal } from '@angular/core';
import { ProjectCard } from '../components/project-card';
import { ProfilePortrait } from '../components/profile-portrait';
import { certifications, education, profile, projects, skills } from '../portfolio.data';
import { Experience } from '../../experience/pages/experience';
import { organizations } from '../../experience/experience.data';
import { PortfolioProject } from '../models/portfolio.model';
import { ProjectGallery } from '../components/project-gallery';

@Component({
  selector: 'app-home',
  imports: [ProjectCard, ProfilePortrait, Experience, ProjectGallery],
  template: `
    <section
      class="hero relative isolate grid grid-cols-[1.25fr_1fr] items-center gap-[76px] pt-[92px] pb-[98px] max-[1000px]:gap-[35px] max-[1000px]:py-[65px] max-[760px]:grid-cols-1 max-[760px]:gap-[45px] max-[760px]:py-[52px] section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="hero-title"
    >
      <div class="hero-copy">
        <p
          class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
        >
          <span
            class="status-dot relative inline-block size-[7px] shrink-0 rounded-full bg-[#586577] shadow-[0_0_0_4px_#58657712]"
          ></span>
          {{ profile.role }} · {{ profile.location }}
        </p>
        <h1
          class="mb-[27px] text-[clamp(46px,5.3vw,74px)] leading-[1.09] font-bold tracking-[-3.7px] max-[1000px]:text-[55px] max-[1000px]:tracking-[-2.7px] max-[760px]:text-[clamp(46px,9vw,66px)]"
          id="hero-title"
        >
          <span class="hero-title-line inline-block">Fullstack</span><br /><span
            class="hero-title-line inline-block serif-accent font-bold not-italic text-accent"
            >Developer</span
          >
        </h1>
        <p
          class="hero-intro mb-7 max-w-[390px] text-[15px] leading-[1.85] text-muted max-[760px]:max-w-[470px] max-[760px]:text-sm [&_strong]:font-semibold [&_strong]:text-ink"
        >
          Hello, I am <strong>{{ profile.name }}.</strong><br />{{ profile.intro }}
        </p>
        <div class="hero-actions flex flex-wrap items-center gap-6 max-[420px]:gap-[15px]">
          <a
            class="button inline-flex items-center justify-center gap-[26px] rounded-[5px] px-[23px] py-4 text-xs font-medium [&>span]:text-[19px] [&>span]:leading-none button-dark bg-ink text-white hover:bg-[#3b414b]"
            href="#work"
            >Explore my work <span aria-hidden="true">↗</span></a
          >
          <a
            class="button inline-flex items-center justify-center gap-[26px] rounded-[5px] px-[23px] py-4 text-xs font-medium [&>span]:text-[19px] [&>span]:leading-none button-gray bg-[#e5e7eb] text-[#22252a] hover:bg-[#d1d5db]"
            href="/CV_Ridhan_Fadhlil_Wafi.pdf"
            download="CV_Ridhan_Fadhlil_Wafi.pdf"
            >Download CV <span aria-hidden="true">↓</span></a
          >
        </div>
        <div
          class="hero-note mt-[45px] flex items-center gap-[13px] text-[10px] leading-[1.6] text-muted max-[760px]:mt-[30px]"
        >
          <span class="little-star text-[32px] font-normal text-accent" aria-hidden="true">+</span>
          Frontend & Fullstack Development<br />Internship experience at Adira Finance
        </div>
      </div>
      <div
        class="hero-visual relative isolate pr-7 max-[760px]:mx-auto max-[760px]:w-full max-[760px]:max-w-[420px] max-[760px]:pl-3"
      >
        <app-profile-portrait [name]="profile.name" />
        <span
          class="vertical-caption absolute top-[142px] right-0 font-mono text-[8px] tracking-[2px] text-muted [writing-mode:vertical-rl]"
          >WEB DEVELOPMENT / BOGOR</span
        >
      </div>
    </section>

    <div
      class="expertise-strip group border-y border-line bg-[#24272c] text-[#e1e3e7]"
      aria-label="Areas of expertise"
    >
      <div
        class="section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)] strip-inner flex min-h-[84px] items-center justify-between gap-5 text-[13px] tracking-[.2px] max-[760px]:flex-wrap max-[760px]:justify-center max-[760px]:gap-x-5 max-[760px]:gap-y-[15px] max-[760px]:py-[22px] max-[760px]:text-[11px] [&_i]:text-[22px] [&_i]:not-italic [&_i]:text-[#858d99] motion-safe:[&_i]:transition-[rotate,color] motion-safe:[&_i]:duration-500 motion-safe:group-hover:[&_i]:rotate-90 motion-safe:group-hover:[&_i]:text-white max-[760px]:[&_i]:text-base max-[760px]:[&_i:nth-of-type(2)]:hidden max-[760px]:[&_span]:basis-[38%] max-[760px]:[&_span]:text-center"
      >
        <span>Frontend Development</span><i aria-hidden="true">+</i>
        <span>Fullstack Development</span><i aria-hidden="true">+</i> <span>API Integration</span
        ><i aria-hidden="true">+</i>
        <span>Backend Development</span>
      </div>
    </div>

    <section
      id="about"
      class="about-section bg-[#e5e6e8] py-20 max-[760px]:py-[55px]"
      aria-labelledby="about-title"
    >
      <div
        class="section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)] education-grid grid grid-cols-[1fr_1.1fr] items-start gap-[60px] max-[760px]:grid-cols-1 max-[760px]:gap-6 [&_h3]:text-2xl [&_h3]:leading-[1.4]"
      >
        <div>
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            01 / EDUCATION
          </p>
          <h2
            class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            id="about-title"
          >
            Foundations of
            <span class="serif-accent font-bold not-italic text-accent">development.</span>
          </h2>
        </div>
        <div
          class="about-copy [&_.eyebrow]:mb-[18px] [&_.eyebrow]:text-muted [&>p:not(.eyebrow)]:mb-4 [&>p:not(.eyebrow)]:text-[13px] [&>p:not(.eyebrow)]:leading-[1.95] [&>p:not(.eyebrow)]:text-muted"
        >
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            {{ education.period }}
          </p>
          <h3>{{ education.institution }}</h3>
          <p>{{ education.major }}</p>
          <p>
            <strong>GPA: {{ education.gpa }}</strong>
          </p>
          <p>{{ education.focus }}</p>
          <p>{{ education.activity }}</p>
        </div>
      </div>
    </section>

    <app-experience />

    <section
      id="work"
      class="work-section py-[100px] max-[760px]:py-[60px] section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="work-title"
    >
      <div
        class="section-heading flex items-end justify-between gap-8 mb-10 max-[760px]:mb-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4 [&_.eyebrow]:mb-[13px] [&_.eyebrow]:text-muted [&>p]:mb-1 [&>p]:text-xs [&>p]:leading-[1.8] [&>p]:text-muted"
      >
        <div>
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            03 / PROJECTS
          </p>
          <h2
            class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            id="work-title"
          >
            From ideas
            <span class="serif-accent font-bold not-italic text-accent">to creations.</span>
          </h2>
        </div>
        <p>Web and mobile application<br />development projects.</p>
      </div>
      <div
        class="project-grid grid grid-cols-2 gap-x-7 gap-y-[38px] max-[760px]:gap-x-[18px] max-[760px]:gap-y-[26px] max-[420px]:grid-cols-1"
      >
        @for (project of projects; track project.id) {
          <app-project-card
            [project]="project"
            (projectSelected)="openProject($event, projectDialog)"
          />
        }
      </div>
    </section>

    <section
      id="organizations"
      class="organization-section pt-[60px] pb-[70px] max-[760px]:pb-[50px] section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="organization-title"
    >
      <div
        class="section-heading flex items-end justify-between gap-8 mb-10 max-[760px]:mb-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4 [&_.eyebrow]:mb-[13px] [&_.eyebrow]:text-muted [&>p]:mb-1 [&>p]:text-xs [&>p]:leading-[1.8] [&>p]:text-muted"
      >
        <div>
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            04 / ORGANIZATIONS & COMMITTEES
          </p>
          <h2
            class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            id="organization-title"
          >
            Organizational experience.
          </h2>
        </div>
      </div>
      <div class="organization-list grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
        @for (organization of organizations; track organization.name) {
          <article
            class="organization-card border-t border-line py-6 motion-safe:transition-[translate,border-color] motion-safe:duration-250 motion-safe:hover:-translate-y-1 motion-safe:hover:border-accent [&_.eyebrow]:mb-3 [&_h3]:text-[18px] [&_h3]:leading-normal [&>p:last-child]:text-[13px] [&>p:last-child]:leading-[1.9] [&>p:last-child]:text-muted"
          >
            <p
              class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
            >
              {{ organization.period }}
            </p>
            <h3>{{ organization.name }}</h3>
            <p>{{ organization.role }}</p>
          </article>
        }
      </div>
    </section>

    <section
      class="certification-section pb-0 section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="certification-title"
    >
      <div
        class="section-heading flex items-end justify-between gap-8 mb-10 max-[760px]:mb-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4 [&_.eyebrow]:mb-[13px] [&_.eyebrow]:text-muted [&>p]:mb-1 [&>p]:text-xs [&>p]:leading-[1.8] [&>p]:text-muted"
      >
        <div>
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            05 / CERTIFICATIONS
          </p>
          <h2
            class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            id="certification-title"
          >
            Learn & <span class="serif-accent font-bold not-italic text-accent">grow.</span>
          </h2>
        </div>
      </div>
      <div
        class="certification-grid grid grid-cols-2 gap-6 max-[760px]:gap-4 max-[600px]:grid-cols-1"
      >
        @for (certificate of certifications; track certificate.name) {
          <article
            class="certification-card relative min-w-0 rounded-xl border border-line bg-white p-7 motion-safe:transition-[translate,border-color] motion-safe:duration-250 motion-safe:hover:-translate-y-1 motion-safe:hover:border-accent max-[760px]:p-[22px] [&_.eyebrow]:mb-3 [&_.eyebrow]:leading-[1.7] [&_.eyebrow]:text-muted [&_h3]:mb-3 [&_h3]:text-[18px] [&_h3]:leading-normal [&_h3]:font-semibold [&_h3]:tracking-[-.4px] [&_h3]:[overflow-wrap:anywhere] [&>p:last-child]:m-0 [&>p:last-child]:text-xs [&>p:last-child]:leading-[1.85] [&>p:last-child]:text-muted"
          >
            <span
              class="certification-year mb-6 block font-mono text-xl text-accent max-[760px]:mb-[18px]"
              >{{ certificate.year }}</span
            >
            <p
              class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
            >
              {{ certificate.issuer }}
            </p>
            <h3>{{ certificate.name }}</h3>
            <p>{{ certificate.description }}</p>
          </article>
        }
      </div>
    </section>

    <section
      id="skills"
      class="skills-section py-[100px] max-[760px]:py-[60px] section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="skills-title"
    >
      <div
        class="section-heading flex items-end justify-between gap-8 mb-10 max-[760px]:mb-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4 [&_.eyebrow]:mb-[13px] [&_.eyebrow]:text-muted [&>p]:mb-1 [&>p]:text-xs [&>p]:leading-[1.8] [&>p]:text-muted"
      >
        <div>
          <p
            class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
          >
            06 / SKILLS
          </p>
          <h2
            class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
            id="skills-title"
          >
            Tools behind
            <span class="serif-accent font-bold not-italic text-accent">the work.</span>
          </h2>
        </div>
        <p>Skills applied across my internships<br />and development projects.</p>
      </div>
      <div class="skills-list border-t border-line">
        @for (skill of skills; track skill.id) {
          <article
            class="skill-row grid grid-cols-[240px_minmax(0,1fr)] items-start gap-8 border-b border-line py-7 motion-safe:transition-colors motion-safe:duration-300 motion-safe:hover:bg-[#e6e9ee55] max-[760px]:grid-cols-1 max-[760px]:gap-4 max-[760px]:py-6 [&_h3]:m-0 [&_h3]:pt-[7px] [&_h3]:text-base [&_h3]:leading-normal [&_h3]:font-semibold [&_h3]:tracking-[-.3px] max-[760px]:[&_h3]:pt-0"
            [attr.aria-labelledby]="'skill-' + skill.id"
          >
            <h3 [id]="'skill-' + skill.id">{{ skill.title }}</h3>
            <ul
              class="skill-badges m-0 flex list-none content-start flex-wrap gap-2 p-0 [&_li]:max-w-full [&_li]:rounded-[6px] [&_li]:border [&_li]:border-[#dce0e5] [&_li]:bg-[#eceef0] [&_li]:px-[10px] [&_li]:py-[7px] [&_li]:text-xs [&_li]:leading-normal [&_li]:font-medium [&_li]:text-[#424a56] [&_li]:[overflow-wrap:anywhere] motion-safe:[&_li]:transition-[translate,background,color,border-color] motion-safe:[&_li]:duration-250 motion-safe:[&_li:hover]:-translate-y-[3px] motion-safe:[&_li:hover]:border-ink motion-safe:[&_li:hover]:bg-ink motion-safe:[&_li:hover]:text-white"
              [attr.aria-label]="skill.title + ' skills'"
            >
              @for (tag of skill.tags; track tag) {
                <li>{{ tag }}</li>
              }
            </ul>
          </article>
        }
      </div>
    </section>

    <section
      id="contact"
      class="contact-section pb-[55px] section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
      aria-labelledby="contact-title"
    >
      <div
        class="contact-panel relative overflow-hidden rounded-[7px] border-t-[3px] border-[#717d90] bg-[#25282e] px-[35px] py-[65px] text-center text-paper max-[760px]:px-[18px] max-[760px]:py-12 [&_.eyebrow]:justify-center [&_.eyebrow]:text-[9px] [&_h2]:text-[clamp(36px,4.3vw,58px)] [&_h2]:tracking-[-2px] [&>p:not(.eyebrow)]:mt-5 [&>p:not(.eyebrow)]:mb-[26px] [&>p:not(.eyebrow)]:text-xs [&>p:not(.eyebrow)]:leading-[1.85] [&>p:not(.eyebrow)]:text-[#c2c7cf] [&_.serif-accent]:text-[#b5becb] [&_.button-dark]:border [&_.button-dark]:border-paper [&_.button-dark]:bg-[#e2e6ec] [&_.button-dark]:text-[#22252a] [&_.button-dark:hover]:bg-white [&_:focus-visible]:outline-[#dbe4f1]"
      >
        <p
          class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
        >
          07 / CONTACT
        </p>
        <h2
          class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
          id="contact-title"
        >
          Have an exciting idea?<br /><span class="serif-accent font-bold not-italic text-accent"
            >Let us bring it to life.</span
          >
        </h2>
        <p>
          A new project, a collaboration, or simply an exchange of ideas.<br />A good conversation
          is always a great start.
        </p>
        @if (profile.email) {
          <a
            class="button inline-flex items-center justify-center gap-[26px] rounded-[5px] px-[23px] py-4 text-xs font-medium [&>span]:text-[19px] [&>span]:leading-none button-dark bg-ink text-white hover:bg-[#3b414b]"
            [href]="'mailto:' + profile.email"
            >Start a conversation <span aria-hidden="true">↗</span></a
          >
          <a
            class="contact-email mx-auto mt-[17px] block w-fit text-[11px] text-[#c2c7cf] motion-safe:transition-[color,background-color,translate] motion-safe:duration-200 motion-safe:hover:-translate-y-[2px]"
            [href]="'mailto:' + profile.email"
            >{{ profile.email }}</a
          >
          <a
            class="contact-email mx-auto mt-[17px] block w-fit text-[11px] text-[#c2c7cf] motion-safe:transition-[color,background-color,translate] motion-safe:duration-200 motion-safe:hover:-translate-y-[2px]"
            [href]="profile.phoneHref"
            >{{ profile.phone }}</a
          >
        } @else {
          <p class="contact-pending">Contact information coming soon.</p>
        }
        <span class="contact-spark hidden" aria-hidden="true">+</span>
      </div>
    </section>
    <footer
      class="site-footer flex min-h-[90px] items-center justify-between gap-5 border-t border-line text-[10px] text-muted max-[760px]:flex-wrap max-[760px]:justify-center max-[760px]:gap-x-[25px] max-[760px]:gap-y-3 max-[760px]:py-[25px] max-[760px]:text-center max-[760px]:[&>span:nth-child(2)]:order-3 max-[760px]:[&>span:nth-child(2)]:basis-full [&_a]:text-ink section-shell mx-auto w-[min(1200px,calc(100%_-_96px))] max-[760px]:w-[calc(100%_-_40px)]"
    >
      <span>© {{ year }} {{ profile.name }}</span
      ><span>Thoughtfully designed. Carefully built.</span><a href="#top">Back to top ↑</a>
    </footer>

    <dialog
      #projectDialog
      class="project-dialog m-auto max-h-[90dvh] w-[min(760px,calc(100%_-_32px))] rounded-xl border border-line bg-paper p-0 text-ink backdrop:bg-[#191c22cc] backdrop:backdrop-blur-[5px]"
      aria-labelledby="dialog-title"
      (click)="closeOnBackdrop($event, projectDialog)"
    >
      @if (selectedProject(); as project) {
        <div class="dialog-content relative">
          <button
            class="dialog-close absolute top-[15px] right-[15px] z-[1] size-10 rounded-full bg-paper motion-safe:transition-[transform,background-color] motion-safe:duration-200 motion-safe:hover:rotate-[8deg]"
            type="button"
            (click)="projectDialog.close()"
            aria-label="Close project details"
            autofocus
          >
            ✕
          </button>
          <app-project-gallery [project]="project" />
          <div
            class="dialog-copy p-[30px] [&_.eyebrow]:mb-3 [&>p:not(.eyebrow)]:my-5 [&>p:not(.eyebrow)]:text-sm [&>p:not(.eyebrow)]:leading-[1.9] [&>p:not(.eyebrow)]:text-muted"
          >
            <p
              class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
            >
              {{ project.category }}
            </p>
            <h2
              class="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.15] font-[650] tracking-[-1.7px]"
              id="dialog-title"
            >
              {{ project.name }}
            </h2>
            <p>{{ project.description }}</p>
            @if (project.url) {
              <p>
                <a
                  class="text-link border-b border-[#959ba4] py-2 text-xs motion-safe:transition-[color,background-color,translate] motion-safe:duration-200 motion-safe:hover:-translate-y-[2px]"
                  [href]="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Visit {{ project.name }} ↗</a
                >
              </p>
            }
            <div
              class="skill-tags flex flex-wrap gap-[6px] [&_span]:rounded-[4px] [&_span]:border [&_span]:border-[#cbd0d7] [&_span]:px-[9px] [&_span]:py-[6px] [&_span]:text-[9px] [&_span]:text-[#555d68]"
            >
              @for (tag of project.tags; track tag) {
                <span>{{ tag }}</span>
              }
            </div>
          </div>
        </div>
      }
    </dialog>
  `,
})
export class Home {
  protected readonly profile = profile;
  protected readonly projects = projects;
  protected readonly year = new Date().getFullYear();
  protected readonly selectedProject = signal<PortfolioProject | null>(null);
  protected readonly organizations = organizations;
  protected readonly education = education;
  protected readonly certifications = certifications;
  protected readonly skills = skills;

  protected openProject(project: PortfolioProject, dialog: HTMLDialogElement): void {
    this.selectedProject.set(project);
    dialog.showModal();
  }

  protected closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) dialog.close();
  }
}
