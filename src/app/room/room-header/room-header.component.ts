import { Component, input, output } from '@angular/core';
import {
  LogoComponent,
  ButtonComponent,
  IconLogoutComponent,
  IconCopyComponent,
} from '../../components';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [LogoComponent, ButtonComponent, IconLogoutComponent, IconCopyComponent],
  templateUrl: './room-header.component.html',
})
export class RoomHeaderComponent {
  roomId = input.required<string>();
  playerCount = input.required<number>();

  leaveRoom = output<void>();
  copyRoomCode = output<void>();
}
