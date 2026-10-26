import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile } from '../../home/portfolio.data';

@Component({
  selector: 'app-contact',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="contact-page-title">
      <a routerLink="/" class="experience-back">← Back to Home</a>
      <p class="eyebrow">LET US CONNECT</p><h1 id="contact-page-title">Contact</h1>
      <p class="project-description">For job opportunities, projects, or web development collaborations.</p>
      <dl class="contact-details">
        <div><dt>Email</dt><dd><a [href]="'mailto:' + profile.email">{{ profile.email }}</a></dd></div>
        <div><dt>Phone</dt><dd><a [href]="profile.phoneHref">{{ profile.phone }}</a></dd></div>
        <div><dt>Location</dt><dd>{{ profile.location }}</dd></div>
        <div><dt>Portfolio</dt><dd><a [href]="profile.portfolioUrl" target="_blank" rel="noopener noreferrer">Canva Portfolio ↗</a></dd></div>
      </dl>
    </section>
  `,
})
export class Contact {
  protected readonly profile = profile;
}
