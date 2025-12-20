import { Component, signal, inject, computed, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { RoomService } from '../services/room.service';
import { RoomHeaderComponent } from './room-header/room-header.component';
import { RoomActionsComponent } from './room-actions/room-actions.component';
import { PlayersAreaComponent } from './players-area/players-area.component';
import { VotingCardsComponent } from './voting-cards/voting-cards.component';
import { JoinModalComponent } from './join-modal/join-modal.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    RoomHeaderComponent,
    RoomActionsComponent,
    PlayersAreaComponent,
    VotingCardsComponent,
    JoinModalComponent,
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
    this.route.paramMap.subscribe((params) => {
      const roomId = params.get('roomId');
      if (roomId && !this.room.isConnected()) {
        this.showJoinModal.set(true);
      }
    });
  }

  ngOnDestroy() {
    this.room.leave();
  }

  async onJoinRoom(name: string) {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (!name.trim() || !roomId) return;

    this.isLoading.set(true);
    try {
      await this.room.joinRoom(roomId, name.trim());
      this.showJoinModal.set(false);
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancelJoin() {
    this.showJoinModal.set(false);
    this.router.navigate(['/']);
  }

  onLeaveRoom() {
    this.room.leave();
    this.router.navigate(['/']);
  }

  onVote(value: string) {
    this.room.vote(value);
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
