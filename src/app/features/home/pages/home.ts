import { Component, signal } from '@angular/core';
import { PortfolioImage } from '../components/portfolio-image';
import { certifications, education, profile, projects } from '../portfolio.data';
import { Experience } from '../../experience/pages/experience';
import { organizations } from '../../experience/experience.data';
import { PortfolioProject } from '../models/portfolio.model';
import { ProjectGallery } from '../components/project-gallery';

@Component({
  selector: 'app-home',
  imports: [PortfolioImage, Experience, ProjectGallery],
  template: `
    <section class="hero section-shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="status-dot"></span> {{ profile.role }} · {{ profile.location }}
        </p>
        <h1 id="hero-title">
          Membangun web.<br /><span class="serif-accent">Menghubungkan ide.</span>
        </h1>
        <p class="hero-intro">
          Halo, saya <strong>{{ profile.name }}.</strong><br />{{ profile.intro }}
        </p>
        <div class="hero-actions">
          <a class="button button-dark" href="#work"
            >Jelajahi karya <span aria-hidden="true">↗</span></a
          >
          <a class="text-link" href="#about">Pendidikan <span aria-hidden="true">↘</span></a>
        </div>
        <div class="hero-note">
          <span class="little-star" aria-hidden="true">+</span> Frontend & Fullstack Development<br />Pengalaman
          magang di Adira Finance
        </div>
      </div>
      <div class="hero-visual">
        <div class="portrait-frame">
          <app-portfolio-image
            src="/images/Profile.jpg"
            [alt]="'Potret ' + profile.name"
            [priority]="true"
          />
          <span class="portrait-caption">THINK. BUILD. REFINE.</span>
        </div>
        <span class="floating-label"
          ><span class="status-dot"></span> Vue.js · TypeScript · Laravel</span
        >
        <span class="hero-spark" aria-hidden="true">+</span>
        <span class="vertical-caption">WEB DEVELOPMENT / BOGOR</span>
      </div>
    </section>

    <div class="expertise-strip" aria-label="Fokus keahlian">
      <div class="section-shell strip-inner">
        <span>Frontend Development</span><i aria-hidden="true">+</i>
        <span>Fullstack Development</span><i aria-hidden="true">+</i> <span>API Integration</span
        ><i aria-hidden="true">+</i>
        <span>Backend Development</span>
      </div>
    </div>

    <section id="about" class="about-section" aria-labelledby="about-title">
      <div class="section-shell education-grid">
        <div>
          <p class="eyebrow">01 / PENDIDIKAN</p>
          <h2 id="about-title">Fondasi <span class="serif-accent">pengembangan.</span></h2>
        </div>
        <div class="about-copy">
          <p class="eyebrow">{{ education.period }}</p>
          <h3>{{ education.institution }}</h3>
          <p>{{ education.major }}</p>
          <p>
            <strong>IPK: {{ education.gpa }}</strong>
          </p>
          <p>{{ education.focus }}</p>
          <p>{{ education.activity }}</p>
        </div>
      </div>
    </section>

    <app-experience />

    <section id="work" class="work-section section-shell" aria-labelledby="work-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">03 / PROYEK</p>
          <h2 id="work-title">Dari ide, <span class="serif-accent">jadi karya.</span></h2>
        </div>
        <p>Proyek pengembangan aplikasi<br />web dan mobile.</p>
      </div>
      <div class="project-grid">
        @for (project of projects; track project.id) {
          <article class="project-card" [class.featured]="project.id === 'style4u'">
            <button
              class="project-preview"
              type="button"
              (click)="openProject(project, projectDialog)"
              [attr.aria-label]="'Lihat detail ' + project.name"
            >
              <app-portfolio-image [src]="project.image" [alt]="'Pratinjau ' + project.name" />
              <span class="preview-pill">Lihat proyek <span aria-hidden="true">↗</span></span>
            </button>
            <div class="project-info">
              <div>
                <p class="project-category">{{ project.category }}</p>
                <h3>
                  <button type="button" (click)="openProject(project, projectDialog)">
                    {{ project.name }}
                  </button>
                </h3>
              </div>
              @if (project.year) {
                <span class="project-number">/ {{ project.year }}</span>
              }
            </div>
          </article>
        }
      </div>
    </section>

    <section
      id="organizations"
      class="organization-section section-shell"
      aria-labelledby="organization-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">04 / ORGANISASI & KEPANITIAAN</p>
          <h2 id="organization-title">Pengalaman organisasi.</h2>
        </div>
      </div>
      <div class="organization-list">
        @for (organization of organizations; track organization.name) {
          <article class="organization-card">
            <p class="eyebrow">{{ organization.period }}</p>
            <h3>{{ organization.name }}</h3>
            <p>{{ organization.role }}</p>
          </article>
        }
      </div>
    </section>

    <section class="certification-section section-shell" aria-labelledby="certification-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">05 / SERTIFIKASI</p>
          <h2 id="certification-title">Belajar & <span class="serif-accent">berkembang.</span></h2>
        </div>
      </div>
      <div class="skill-grid">
        @for (certificate of certifications; track certificate.name) {
          <article class="skill-card">
            <span class="skill-index">{{ certificate.year }}</span>
            <p class="eyebrow">{{ certificate.issuer }}</p>
            <h3>{{ certificate.name }}</h3>
            <p>{{ certificate.description }}</p>
          </article>
        }
      </div>
    </section>

    <section id="contact" class="contact-section section-shell" aria-labelledby="contact-title">
      <div class="contact-panel">
        <p class="eyebrow">06 / KONTAK</p>
        <h2 id="contact-title">
          Punya ide menarik?<br /><span class="serif-accent">Mari kita wujudkan.</span>
        </h2>
        <p>
          Proyek baru, kolaborasi, atau sekadar bertukar ide.<br />Percakapan yang baik selalu jadi
          awal yang baik.
        </p>
        @if (profile.email) {
          <a class="button button-dark" [href]="'mailto:' + profile.email"
            >Mulai percakapan <span aria-hidden="true">↗</span></a
          >
          <a class="contact-email" [href]="'mailto:' + profile.email">{{ profile.email }}</a>
          <a class="contact-email" [href]="profile.phoneHref">{{ profile.phone }}</a>
        } @else {
          <p class="contact-pending">Informasi kontak segera tersedia.</p>
        }
        <span class="contact-spark" aria-hidden="true">+</span>
      </div>
    </section>
    <footer class="site-footer section-shell">
      <span>© {{ year }} {{ profile.name }}</span
      ><span>Thoughtfully designed. Carefully built.</span><a href="#top">Kembali ke atas ↑</a>
    </footer>

    <dialog
      #projectDialog
      class="project-dialog"
      aria-labelledby="dialog-title"
      (click)="closeOnBackdrop($event, projectDialog)"
    >
      @if (selectedProject(); as project) {
        <div class="dialog-content">
          <button
            class="dialog-close"
            type="button"
            (click)="projectDialog.close()"
            aria-label="Tutup detail proyek"
            autofocus
          >
            ✕
          </button>
          <app-project-gallery [project]="project" />
          <div class="dialog-copy">
            <p class="eyebrow">{{ project.category }}</p>
            <h2 id="dialog-title">{{ project.name }}</h2>
            <p>{{ project.description }}</p>
            @if (project.url) {
              <p>
                <a class="text-link" [href]="project.url" target="_blank" rel="noopener noreferrer"
                  >Kunjungi {{ project.name }} ↗</a
                >
              </p>
            }
            <div class="skill-tags">
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

  protected openProject(project: PortfolioProject, dialog: HTMLDialogElement): void {
    this.selectedProject.set(project);
    dialog.showModal();
  }

  protected closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) dialog.close();
  }
}
