import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      (click)="clicked.emit()"
      class="flex items-center justify-center gap-2 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      [class.px-8]="size() === 'lg'"
      [class.py-4]="size() === 'lg'"
      [class.text-base]="size() === 'lg'"
      [class.px-4]="size() === 'md'"
      [class.py-3]="size() === 'md'"
      [class.text-sm]="size() === 'md' || size() === 'sm'"
      [class.px-3]="size() === 'sm'"
      [class.py-2]="size() === 'sm'"
      [class.rounded-xl]="true"
      [class.w-full]="fullWidth()"
      [class.bg-violet-600]="variant() === 'primary'"
      [class.hover:bg-violet-500]="variant() === 'primary'"
      [class.text-white]="variant() === 'primary' || variant() === 'secondary'"
      [class.shadow-lg]="variant() === 'primary' || variant() === 'secondary'"
      [class.disabled:shadow-none]="variant() === 'primary' || variant() === 'secondary'"
      [class.bg-cyan-600]="variant() === 'secondary'"
      [class.hover:bg-cyan-500]="variant() === 'secondary'"
      [class.bg-cyan-500/20]="variant() === 'outline'"
      [class.hover:bg-cyan-500/30]="variant() === 'outline'"
      [class.border]="variant() === 'outline' || variant() === 'ghost'"
      [class.border-cyan-500/30]="variant() === 'outline'"
      [class.hover:border-cyan-500/50]="variant() === 'outline'"
      [class.text-cyan-600]="variant() === 'outline'"
      [class.dark:text-cyan-400]="variant() === 'outline'"
      [class.text-slate-500]="variant() === 'ghost'"
      [class.dark:text-slate-400]="variant() === 'ghost'"
      [class.hover:text-red-500]="variant() === 'ghost'"
      [class.dark:hover:text-red-400]="variant() === 'ghost'"
      [class.hover:bg-red-50]="variant() === 'ghost'"
      [class.dark:hover:bg-red-900/20]="variant() === 'ghost'"
      [class.border-slate-200]="variant() === 'ghost'"
      [class.dark:border-slate-700]="variant() === 'ghost'"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);

  clicked = output<void>();
}

