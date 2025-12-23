import { Component, input, output } from '@angular/core';
import { Player } from '../../services/room.service';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
  selector: 'app-players-area',
  standalone: true,
  imports: [PlayerCardComponent],
  template: `
    <div class="mb-10 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        @for (player of players(); track player.id) {
        <app-player-card
          [player]="player"
          [isCurrentPlayer]="player.id === currentPlayerId()"
          [isRevealed]="isRevealed()"
          (editName)="editName.emit()"
        />
        }
      </div>
    </div>
  `,
})
export class PlayersAreaComponent {
  players = input.required<Player[]>();
  currentPlayerId = input<string | null>(null);
  isRevealed = input<boolean>(false);

  editName = output<void>();
}

