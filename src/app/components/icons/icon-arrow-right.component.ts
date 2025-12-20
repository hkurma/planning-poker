import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-arrow-right',
  standalone: true,
  template: `
    <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
    </svg>
  `,
  host: { class: 'block' },
})
export class IconArrowRightComponent {}

