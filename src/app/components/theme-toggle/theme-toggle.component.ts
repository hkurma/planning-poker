import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { IconSunComponent } from '../icons/icon-sun.component';
import { IconMoonComponent } from '../icons/icon-moon.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [IconSunComponent, IconMoonComponent],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="fixed top-4 right-4 z-50 p-3 rounded-xl transition-all duration-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
    >
      @if (themeService.isDarkMode()) {
        <app-icon-sun class="w-5 h-5 text-amber-400" />
      } @else {
        <app-icon-moon class="w-5 h-5 text-violet-600" />
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
