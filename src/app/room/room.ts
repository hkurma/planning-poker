import { Component, signal, inject, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { RoomService } from '../services/room.service';
import { RoomHeaderComponent } from './room-header/room-header.component';
import { RoomActionsComponent } from './room-actions/room-actions.component';
import { PlayersAreaComponent } from './players-area/players-area.component';
import { VotingCardsComponent } from './voting-cards/voting-cards.component';
import { JoinModalComponent } from './join-modal/join-modal.component';
import { NotFoundModalComponent } from './not-found-modal/not-found-modal.component';
import { EditNameModalComponent } from './edit-name-modal/edit-name-modal.component';

const STORAGE_KEY = 'sprintpokr-username';
const HOSTED_ROOM_KEY = 'sprintpokr-hosted-room';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    RoomHeaderComponent,
    RoomActionsComponent,
    PlayersAreaComponent,
    VotingCardsComponent,
    JoinModalComponent,
    NotFoundModalComponent,
    EditNameModalComponent,
  ],
  templateUrl: './room.html',
})
export class Room implements OnInit, OnDestroy {
  protected readonly room = inject(RoomService);
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // UI state
  readonly isLoading = signal(false);
  readonly showJoinModal = signal(false);
  readonly showCopiedToast = signal(false);
  readonly showConnectionError = signal(false);
  readonly showEditNameModal = signal(false);

  // Watch for host disconnection - show same "Room Not Found" modal
  private hostDisconnectEffect = effect(() => {
    if (this.room.hostDisconnected() && !this.isLoading()) {
      this.showConnectionError.set(true);
    }
  });

  // Computed values for consensus
  readonly hasConsensus = computed(() => {
    const votes = this.room
      .players()
      .map((p) => p.vote)
      .filter((v): v is string => v !== null);
    if (votes.length === 0) return false;
    return new Set(votes).size === 1;
  });

  readonly consensusState = computed<'none' | 'consensus' | 'no-consensus'>(() => {
    if (!this.room.isRevealed()) return 'none';
    return this.hasConsensus() ? 'consensus' : 'no-consensus';
  });

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const roomId = params.get('roomId');
      if (roomId && !this.room.isConnected()) {
        const savedName = localStorage.getItem(STORAGE_KEY);
        const hostedRoom = localStorage.getItem(HOSTED_ROOM_KEY);
        
        if (savedName) {
          // Check if user was the previous host of this room
          if (hostedRoom === roomId) {
            await this.onRejoinAsHost(savedName);
          } else {
            // Auto-join with saved name
            await this.onJoinRoom(savedName);
          }
        } else {
          // Show modal to enter name
          this.showJoinModal.set(true);
        }
      }
    });
  }

  ngOnDestroy() {
    this.room.leave();
  }

  async onJoinRoom(name: string) {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (!name.trim() || !roomId) return;

    // Save name to localStorage
    localStorage.setItem(STORAGE_KEY, name.trim());

    this.isLoading.set(true);
    try {
      await this.room.joinRoom(roomId, name.trim());
      this.showJoinModal.set(false);
    } catch (error) {
      console.error('Failed to join room:', error);
      this.showJoinModal.set(false);
      this.showConnectionError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onRejoinAsHost(name: string) {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (!name.trim() || !roomId) return;

    this.isLoading.set(true);
    try {
      await this.room.rejoinAsHost(roomId, name.trim());
      // Re-save the hosted room (in case it was cleared)
      localStorage.setItem(HOSTED_ROOM_KEY, roomId);
    } catch (error) {
      console.error('Failed to rejoin as host:', error);
      // Clear hosted room since we couldn't reclaim it
      localStorage.removeItem(HOSTED_ROOM_KEY);
      this.showConnectionError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancelJoin() {
    this.showJoinModal.set(false);
    this.router.navigate(['/lobby']);
  }

  onReturnToLobby() {
    this.showConnectionError.set(false);
    this.room.leave();
    this.router.navigate(['/lobby']);
  }

  async onRetry() {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    const savedName = localStorage.getItem(STORAGE_KEY);
    const hostedRoom = localStorage.getItem(HOSTED_ROOM_KEY);
    if (!roomId || !savedName) return;

    // Reset state and show loading overlay
    this.showConnectionError.set(false);
    this.room.prepareForReconnect();
    this.isLoading.set(true);
    
    try {
      // Check if user was the host - rejoin as host
      if (hostedRoom === roomId) {
        await this.room.rejoinAsHost(roomId, savedName);
      } else {
        await this.room.joinRoom(roomId, savedName);
      }
    } catch (error) {
      console.error('Failed to reconnect:', error);
      this.showConnectionError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  onLeaveRoom() {
    // Clear hosted room when intentionally leaving
    localStorage.removeItem(HOSTED_ROOM_KEY);
    this.room.leave();
    this.router.navigate(['/lobby']);
  }

  onVote(value: string) {
    this.room.vote(value);
  }

  onNameSaved(newName: string) {
    this.room.updateName(newName);
    // Update localStorage with new name
    localStorage.setItem(STORAGE_KEY, newName);
    this.showEditNameModal.set(false);
  }

  onReveal() {
    this.room.reveal();

    // Fire confetti from center if consensus
    if (this.hasConsensus()) {
      this.fireConfetti();
    }
  }

  onReset() {
    this.room.reset();
  }

  onCopyRoomCode() {
    const id = this.room.roomId();
    if (id) {
      navigator.clipboard.writeText(id).then(() => {
        this.showCopiedToast.set(true);
        setTimeout(() => this.showCopiedToast.set(false), 2000);
      });
    }
  }

  private fireConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
    });
  }
}
