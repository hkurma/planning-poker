import { Component, input, output } from '@angular/core';
import { Player } from '../../services/room.service';
import { IconCheckComponent, IconEditComponent } from '../../components';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [IconCheckComponent, IconEditComponent],
  templateUrl: './player-card.component.html',
})
export class PlayerCardComponent {
  player = input.required<Player>();
  isCurrentPlayer = input<boolean>(false);
  isRevealed = input<boolean>(false);

  editName = output<void>();
}
