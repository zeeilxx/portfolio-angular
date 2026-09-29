import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile } from '../../home/portfolio.data';

@Component({
  selector: 'app-contact',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="contact-page-title">
      <a routerLink="/" class="experience-back">← Kembali ke Home</a>
      <p class="eyebrow">MARI TERHUBUNG</p><h1 id="contact-page-title">Contact</h1>
      <p class="project-description">Untuk peluang kerja, proyek, atau kolaborasi pengembangan web.</p>
      <dl class="contact-details">
        <div><dt>Email</dt><dd><a [href]="'mailto:' + profile.email">{{ profile.email }}</a></dd></div>
        <div><dt>Telepon</dt><dd><a [href]="profile.phoneHref">{{ profile.phone }}</a></dd></div>
        <div><dt>Lokasi</dt><dd>{{ profile.location }}</dd></div>
        <div><dt>Portofolio</dt><dd><a [href]="profile.portfolioUrl" target="_blank" rel="noopener noreferrer">Portofolio Canva ↗</a></dd></div>
      </dl>
    </section>
  `,
})
export class Contact {
  protected readonly profile = profile;
}
