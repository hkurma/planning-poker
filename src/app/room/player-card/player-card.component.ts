import { Component, input } from '@angular/core';
import { Player } from '../../services/room.service';
import { IconCheckComponent } from '../../components';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [IconCheckComponent],
  templateUrl: './player-card.component.html',
})
export class PlayerCardComponent {
  player = input.required<Player>();
  isCurrentPlayer = input<boolean>(false);
  isRevealed = input<boolean>(false);
}
