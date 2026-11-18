import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile } from '../../home/portfolio.data';

@Component({
  selector: 'app-contact',
  imports: [RouterLink],
  host: { class: 'mx-auto my-[60px] block max-w-[1200px] px-8' },
  template: `
    <section aria-labelledby="contact-page-title">
      <a
        routerLink="/"
        class="experience-back mb-[50px] inline-block text-[11px] text-muted max-[760px]:mb-[35px]"
        >← Back to Home</a
      >
      <p
        class="eyebrow flex items-center gap-[9px] mb-[25px] font-mono text-[10px] leading-[1.8] font-semibold tracking-[1.7px] uppercase"
      >
        LET US CONNECT
      </p>
      <h1
        class="mb-[27px] text-[clamp(46px,5.3vw,74px)] leading-[1.09] font-bold tracking-[-3.7px] max-[1000px]:text-[55px] max-[1000px]:tracking-[-2.7px] max-[760px]:text-[clamp(46px,9vw,66px)]"
        id="contact-page-title"
      >
        Contact
      </h1>
      <p class="project-description my-5 text-[13px] leading-[1.9] text-muted">
        For job opportunities, projects, or web development collaborations.
      </p>
      <dl
        class="contact-details grid gap-6 py-5 [&_dt]:mb-2 [&_dt]:text-xs [&_dt]:text-muted [&_dd]:m-0 [&_dd]:[overflow-wrap:anywhere] [&_a]:underline [&_a]:underline-offset-4"
      >
        <div>
          <dt>Email</dt>
          <dd>
            <a [href]="'mailto:' + profile.email">{{ profile.email }}</a>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a [href]="profile.phoneHref">{{ profile.phone }}</a>
          </dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{{ profile.location }}</dd>
        </div>
        <div>
          <dt>Portfolio</dt>
          <dd>
            <a [href]="profile.portfolioUrl" target="_blank" rel="noopener noreferrer"
              >Canva Portfolio ↗</a
            >
          </dd>
        </div>
      </dl>
    </section>
  `,
})
export class Contact {
  protected readonly profile = profile;
}
