import { Injectable, signal } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';

export type MessageHandler = (type: string, payload: any, conn?: DataConnection) => void;

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peer: Peer | null = null;
  private connections = new Map<string, DataConnection>();
  private messageHandler: MessageHandler | null = null;

  readonly peerId = signal<string | null>(null);
  readonly isConnected = signal(false);
  readonly connectionError = signal<string | null>(null);
  readonly hostDisconnected = signal(false);

  onMessage(handler: MessageHandler) {
    this.messageHandler = handler;
  }

  async initialize(peerId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(peerId, { debug: 1 });

      this.peer.on('open', (id) => {
        this.peerId.set(id);
        // Don't set isConnected here - only set when actually connected to a room
        resolve(id);
      });

      this.peer.on('connection', (conn) => {
        this.setupConnection(conn);
      });

      this.peer.on('error', (err) => {
        this.connectionError.set(err.message);
        this.isConnected.set(false);
        reject(err);
      });
    });
  }

  async connect(hostId: string): Promise<DataConnection> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer not initialized'));
        return;
      }

      const conn = this.peer.connect(hostId, { reliable: true });

      conn.on('open', () => {
        clearTimeout(timeout);
        this.connections.set(hostId, conn);
        this.setupHostConnectionMonitoring(conn);
        this.isConnected.set(true);
        resolve(conn);
      });

      conn.on('data', (data: any) => {
        this.messageHandler?.(data.type, data.payload, conn);
      });

      conn.on('close', () => {
        this.handleHostDisconnect(hostId);
      });

      conn.on('error', (err) => {
        clearTimeout(timeout);
        this.connectionError.set(err.message);
        this.isConnected.set(false);
        reject(err);
      });

      // Timeout for connection - reject if host doesn't respond
      const timeout = setTimeout(() => {
        if (!conn.open) {
          conn.close();
          this.isConnected.set(false);
          reject(new Error('Room not found or host unavailable'));
        }
      }, 5000);
    });
  }

  private setupHostConnectionMonitoring(conn: DataConnection) {
    // Access the underlying RTCPeerConnection to monitor ICE state
    const peerConnection = (conn as any).peerConnection as RTCPeerConnection;
    if (peerConnection) {
      peerConnection.oniceconnectionstatechange = () => {
        const state = peerConnection.iceConnectionState;
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          this.handleHostDisconnect(conn.peer);
        }
      };
    }
  }

  private handleHostDisconnect(hostId: string) {
    if (this.hostDisconnected()) return; // Prevent multiple triggers
    this.connections.delete(hostId);
    this.isConnected.set(false);
    this.hostDisconnected.set(true);
  }

  setConnected(value: boolean) {
    this.isConnected.set(value);
  }

  send(conn: DataConnection, type: string, payload: any) {
    conn.send({ type, payload });
  }

  broadcast(type: string, payload: any, excludePeerId?: string) {
    this.connections.forEach((conn, peerId) => {
      if (peerId !== excludePeerId) {
        conn.send({ type, payload });
      }
    });
  }

  disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    this.peer?.destroy();
    this.peer = null;
    this.peerId.set(null);
    this.isConnected.set(false);
    this.connectionError.set(null);
    this.hostDisconnected.set(false);
  }

  resetForReconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    this.peer?.destroy();
    this.peer = null;
    this.peerId.set(null);
    this.isConnected.set(false);
    this.connectionError.set(null);
    this.hostDisconnected.set(false);
  }

  private setupConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      this.setupGuestConnectionMonitoring(conn);
    });

    conn.on('data', (data: any) => {
      this.messageHandler?.(data.type, data.payload, conn);
    });

    conn.on('close', () => {
      this.handleGuestDisconnect(conn.peer);
    });
  }

  private setupGuestConnectionMonitoring(conn: DataConnection) {
    const peerConnection = (conn as any).peerConnection as RTCPeerConnection;
    if (peerConnection) {
      peerConnection.oniceconnectionstatechange = () => {
        const state = peerConnection.iceConnectionState;
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          this.handleGuestDisconnect(conn.peer);
        }
      };
    }
  }

  private handleGuestDisconnect(peerId: string) {
    if (!this.connections.has(peerId)) return; // Already handled
    this.connections.delete(peerId);
    this.messageHandler?.('player-left', peerId);
  }
}
