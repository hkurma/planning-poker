import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../services/room.service';
import {
  LogoComponent,
  CardComponent,
  ButtonComponent,
  InputComponent,
  IconPlusComponent,
  IconArrowRightComponent,
} from '../components';

const STORAGE_KEY = 'sprintpokr-username';
const HOSTED_ROOM_KEY = 'sprintpokr-hosted-room';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    IconPlusComponent,
    IconArrowRightComponent,
  ],
  templateUrl: './lobby.html',
})
export class Lobby implements OnInit {
  protected readonly room = inject(RoomService);
  private readonly router = inject(Router);

  readonly playerName = signal('');
  readonly roomCode = signal('');
  readonly isLoading = signal(false);

  ngOnInit() {
    const savedName = localStorage.getItem(STORAGE_KEY);
    if (savedName) {
      this.playerName.set(savedName);
    }
  }

  async onCreateRoom() {
    const name = this.playerName();
    if (!name.trim()) return;

    this.saveName(name.trim());
    this.isLoading.set(true);
    try {
      const roomId = await this.room.createRoom(name.trim());
      // Save hosted room ID for potential rejoin
      localStorage.setItem(HOSTED_ROOM_KEY, roomId);
      this.router.navigate(['/room', roomId]);
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

    this.saveName(name.trim());
    this.isLoading.set(true);
    try {
      await this.room.joinRoom(roomId.trim(), name.trim());
      this.router.navigate(['/room', roomId.trim()]);
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private saveName(name: string) {
    localStorage.setItem(STORAGE_KEY, name);
  }
}
