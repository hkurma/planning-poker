import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { BackgroundComponent, ThemeToggleComponent } from './components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BackgroundComponent, ThemeToggleComponent],
  templateUrl: './app.html',
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
  host: {
    '[class.dark]': 'themeService.isDarkMode()',
  },
})
export class App {
  protected readonly themeService = inject(ThemeService);
}
