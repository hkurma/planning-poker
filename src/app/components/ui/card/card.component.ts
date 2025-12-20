import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="rounded-2xl border transition-all"
      [class.bg-white]="!variant() || variant() === 'default'"
      [class.dark:bg-slate-900]="!variant() || variant() === 'default'"
      [class.border-slate-200]="!variant() || variant() === 'default'"
      [class.dark:border-slate-700]="!variant() || variant() === 'default'"
      [class.shadow-xl]="!variant() || variant() === 'default'"
      [class.bg-slate-50]="variant() === 'muted'"
      [class.dark:bg-slate-800/50]="variant() === 'muted'"
      [class.p-8]="padding() === 'default'"
      [class.md:p-10]="padding() === 'default'"
      [class.p-6]="padding() === 'sm'"
      [class.p-4]="padding() === 'xs'"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  variant = input<'default' | 'muted'>('default');
  padding = input<'default' | 'sm' | 'xs'>('default');
}

