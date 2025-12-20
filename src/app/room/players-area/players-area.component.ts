import { Component, input } from '@angular/core';
import { Player } from '../../services/room.service';
import { CardComponent } from '../../components';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
  selector: 'app-players-area',
  standalone: true,
  imports: [CardComponent, PlayerCardComponent],
  template: `
    <div class="mb-10">
      <app-card variant="muted" padding="default">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          @for (player of players(); track player.id) {
          <app-player-card
            [player]="player"
            [isCurrentPlayer]="player.id === currentPlayerId()"
            [isRevealed]="isRevealed()"
          />
          }
        </div>
      </app-card>
    </div>
  `,
})
export class PlayersAreaComponent {
  players = input.required<Player[]>();
  currentPlayerId = input<string | null>(null);
  isRevealed = input<boolean>(false);
}

