import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-check',
  standalone: true,
  template: `
    <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  `,
  host: { class: 'block' },
})
export class IconCheckComponent {}

