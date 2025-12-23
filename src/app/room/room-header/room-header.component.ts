import { Component, input, output } from '@angular/core';
import {
  LogoComponent,
  ButtonComponent,
  IconLogoutComponent,
  IconCopyComponent,
  IconCheckComponent,
} from '../../components';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [LogoComponent, ButtonComponent, IconLogoutComponent, IconCopyComponent, IconCheckComponent],
  templateUrl: './room-header.component.html',
})
export class RoomHeaderComponent {
  roomId = input.required<string>();
  playerCount = input.required<number>();
  showCopied = input<boolean>(false);

  leaveRoom = output<void>();
  copyRoomCode = output<void>();
}
