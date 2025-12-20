import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [type]="type()"
      [(ngModel)]="value"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      class="w-full border transition-all focus:outline-none"
      [class.px-6]="size() === 'lg'"
      [class.py-5]="size() === 'lg'"
      [class.text-lg]="size() === 'lg'"
      [class.rounded-2xl]="size() === 'lg'"
      [class.px-4]="size() === 'md' || size() === 'sm'"
      [class.py-3]="size() === 'md'"
      [class.py-2]="size() === 'sm'"
      [class.text-sm]="size() === 'sm'"
      [class.rounded-xl]="size() === 'md' || size() === 'sm'"
      [class.bg-black/5]="true"
      [class.dark:bg-white/5]="true"
      [class.border-black/10]="true"
      [class.dark:border-white/10]="true"
      [class.text-slate-800]="true"
      [class.dark:text-white]="true"
      [class.placeholder-slate-400]="true"
      [class.dark:placeholder-white/30]="true"
      [class.focus:border-violet-500/50]="variant() === 'default'"
      [class.focus:ring-2]="true"
      [class.focus:ring-violet-500/20]="variant() === 'default'"
      [class.focus:border-cyan-500/50]="variant() === 'cyan'"
      [class.focus:ring-cyan-500/20]="variant() === 'cyan'"
      [class.font-medium]="!monospace()"
      [class.font-mono]="monospace()"
      [class.text-center]="centered()"
      [class.tracking-wider]="monospace()"
    />
  `,
})
export class InputComponent {
  type = input<'text' | 'password' | 'email'>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  variant = input<'default' | 'cyan'>('default');
  monospace = input<boolean>(false);
  centered = input<boolean>(false);

  value = model<string>('');
}

