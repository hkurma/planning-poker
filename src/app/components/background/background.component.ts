import { Component } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  template: `
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-violet-100/50 dark:from-violet-950/30 via-transparent to-cyan-100/50 dark:to-cyan-950/30"></div>

      <!-- Animated Grid -->
      <div class="absolute inset-0 opacity-30 dark:opacity-20"
           style="background-image: linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px);
                  background-size: 50px 50px;
                  animation: gridMove 20s linear infinite;">
      </div>

      <!-- Floating Orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-400/10 dark:bg-fuchsia-600/10 rounded-full blur-[80px] animate-pulse" style="animation-delay: 2s;"></div>
    </div>
  `,
})
export class BackgroundComponent {}

