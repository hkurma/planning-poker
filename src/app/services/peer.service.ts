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

  onMessage(handler: MessageHandler) {
    this.messageHandler = handler;
  }

  async initialize(peerId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(peerId, { debug: 1 });

      this.peer.on('open', (id) => {
        this.peerId.set(id);
        this.isConnected.set(true);
        resolve(id);
      });

      this.peer.on('connection', (conn) => {
        this.setupConnection(conn);
      });

      this.peer.on('error', (err) => {
        this.connectionError.set(err.message);
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
        this.connections.set(hostId, conn);
        resolve(conn);
      });

      conn.on('data', (data: any) => {
        this.messageHandler?.(data.type, data.payload, conn);
      });

      conn.on('close', () => {
        this.connections.delete(hostId);
        this.isConnected.set(false);
        this.connectionError.set('Disconnected from room');
      });

      conn.on('error', (err) => {
        this.connectionError.set(err.message);
        reject(err);
      });

      setTimeout(() => {
        if (!conn.open) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
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
  }

  private setupConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data: any) => {
      this.messageHandler?.(data.type, data.payload, conn);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.messageHandler?.('player-left', conn.peer);
    });
  }
}
