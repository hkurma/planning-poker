import { Injectable, signal, computed, inject } from '@angular/core';
import { DataConnection } from 'peerjs';
import { PeerService } from './peer.service';
import { generateRoomId } from '../utils/room-id';

export interface Player {
  id: string;
  name: string;
  vote: string | null;
  isHost: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly peer = inject(PeerService);

  // Room state
  readonly roomId = signal<string | null>(null);
  readonly isHost = signal(false);
  readonly isRevealed = signal(false);
  readonly players = signal<Player[]>([]);
  readonly currentPlayer = signal<Player | null>(null);

  // Expose connection state from PeerService
  readonly isConnected = this.peer.isConnected;
  readonly connectionError = this.peer.connectionError;

  // Computed
  readonly allVoted = computed(() => {
    const playerList = this.players();
    return playerList.length > 0 && playerList.every((p) => p.vote !== null);
  });

  constructor() {
    this.peer.onMessage((type, payload, conn) => this.handleMessage(type, payload, conn));
  }

  async createRoom(playerName: string): Promise<string> {
    const roomId = generateRoomId();
    await this.peer.initialize(roomId);

    const player: Player = {
      id: roomId,
      name: playerName,
      vote: null,
      isHost: true,
    };

    this.roomId.set(roomId);
    this.isHost.set(true);
    this.currentPlayer.set(player);
    this.players.set([player]);

    return roomId;
  }

  async joinRoom(roomId: string, playerName: string): Promise<void> {
    const peerId = `${roomId}-${Date.now()}`;
    await this.peer.initialize(peerId);
    const conn = await this.peer.connect(roomId);

    const player: Player = {
      id: peerId,
      name: playerName,
      vote: null,
      isHost: false,
    };

    this.roomId.set(roomId);
    this.isHost.set(false);
    this.currentPlayer.set(player);

    this.peer.send(conn, 'join', player);
  }

  vote(value: string) {
    const current = this.currentPlayer();
    if (!current) return;

    this.updatePlayerVote(current.id, value);
    this.peer.broadcast('vote', { playerId: current.id, vote: value });
  }

  reveal() {
    this.isRevealed.set(true);
    this.peer.broadcast('reveal', null);
  }

  reset() {
    this.resetVotes();
    this.peer.broadcast('reset', null);
  }

  leave() {
    this.peer.disconnect();
    this.resetState();
  }

  // Message handling
  private handleMessage(type: string, payload: any, conn?: DataConnection) {
    switch (type) {
      case 'join':
        this.handlePlayerJoin(payload, conn!);
        break;
      case 'vote':
        this.updatePlayerVote(payload.playerId, payload.vote);
        break;
      case 'reveal':
        this.isRevealed.set(true);
        break;
      case 'reset':
        this.resetVotes();
        break;
      case 'sync':
        this.syncState(payload.players, payload.isRevealed);
        break;
      case 'player-left':
        this.removePlayer(payload);
        break;
    }
  }

  private handlePlayerJoin(player: Player, conn: DataConnection) {
    this.addOrUpdatePlayer(player);

    const syncPayload = {
      players: this.players(),
      isRevealed: this.isRevealed(),
    };

    this.peer.send(conn, 'sync', syncPayload);
    this.peer.broadcast('sync', syncPayload, conn.peer);
  }

  // State helpers
  private addOrUpdatePlayer(player: Player) {
    const current = this.players();
    const index = current.findIndex((p) => p.id === player.id);

    if (index >= 0) {
      const updated = [...current];
      updated[index] = player;
      this.players.set(updated);
    } else {
      this.players.set([...current, player]);
    }
  }

  private removePlayer(playerId: string) {
    this.players.set(this.players().filter((p) => p.id !== playerId));
  }

  private updatePlayerVote(playerId: string, vote: string) {
    this.players.set(this.players().map((p) => (p.id === playerId ? { ...p, vote } : p)));

    const current = this.currentPlayer();
    if (current?.id === playerId) {
      this.currentPlayer.set({ ...current, vote });
    }
  }

  private syncState(players: Player[], isRevealed: boolean) {
    const current = this.currentPlayer();

    const mergedPlayers = players.map((p) => {
      if (current && p.id === current.id) {
        return { ...p, ...current };
      }
      return p;
    });

    if (current && !mergedPlayers.find((p) => p.id === current.id)) {
      mergedPlayers.push(current);
    }

    this.players.set(mergedPlayers);
    this.isRevealed.set(isRevealed);
  }

  private resetVotes() {
    this.players.set(this.players().map((p) => ({ ...p, vote: null })));

    const current = this.currentPlayer();
    if (current) {
      this.currentPlayer.set({ ...current, vote: null });
    }

    this.isRevealed.set(false);
  }

  private resetState() {
    this.roomId.set(null);
    this.isHost.set(false);
    this.isRevealed.set(false);
    this.players.set([]);
    this.currentPlayer.set(null);
  }
}

