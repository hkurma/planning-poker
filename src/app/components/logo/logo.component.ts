import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    @if (size() === 'full') {
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-3 mb-4">
        <div class="relative">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center transform rotate-12 shadow-lg shadow-violet-500/30">
            <span class="text-2xl transform -rotate-12">🎯</span>
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-xs shadow-lg text-white">
            ∞
          </div>
        </div>
        <div class="text-left">
          <h1 class="text-4xl font-black tracking-tight">
            <span class="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">POINT</span>
            <span class="text-slate-800 dark:text-white/90">STORM</span>
          </h1>
          <p class="text-xs text-slate-500 dark:text-white/40 tracking-[0.3em] uppercase">Peer-to-Peer Planning Poker</p>
        </div>
      </div>
    </div>
    } @else {
    <h2 class="text-xl font-bold text-slate-800 dark:text-white">
      <span class="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">POINT</span>STORM
    </h2>
    }
  `,
})
export class LogoComponent {
  size = input<'full' | 'compact'>('full');
}

