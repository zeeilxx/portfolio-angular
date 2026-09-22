import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <div class="mx-auto max-w-5xl px-6">
        <app-navbar />
        <main class="py-12">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class App {}
