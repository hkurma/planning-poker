import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import {
  LogoComponent,
  CardComponent,
  ButtonComponent,
  InputComponent,
  IconPlusComponent,
  IconArrowRightComponent,
} from '../components';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    LogoComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    IconPlusComponent,
    IconArrowRightComponent,
  ],
  templateUrl: './lobby.html',
})
export class Lobby {
  protected readonly room = inject(RoomService);
  private readonly router = inject(Router);

  readonly playerName = signal('');
  readonly roomCode = signal('');
  readonly isLoading = signal(false);

  async onCreateRoom() {
    const name = this.playerName();
    if (!name.trim()) return;

    this.isLoading.set(true);
    try {
      const roomId = await this.room.createRoom(name.trim());
      this.router.navigate(['/', roomId]);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onJoinRoom() {
    const name = this.playerName();
    const roomId = this.roomCode();
    if (!name.trim() || !roomId.trim()) return;

    this.isLoading.set(true);
    try {
      await this.room.joinRoom(roomId.trim(), name.trim());
      this.router.navigate(['/', roomId.trim()]);
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
