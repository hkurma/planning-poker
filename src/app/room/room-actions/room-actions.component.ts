import { Component, input, output } from '@angular/core';
import { ButtonComponent, IconEyeComponent, IconRefreshComponent } from '../../components';

@Component({
  selector: 'app-room-actions',
  standalone: true,
  imports: [ButtonComponent, IconEyeComponent, IconRefreshComponent],
  templateUrl: './room-actions.component.html',
})
export class RoomActionsComponent {
  isHost = input.required<boolean>();
  isRevealed = input.required<boolean>();
  allVoted = input.required<boolean>();

  reveal = output<void>();
  reset = output<void>();
}

