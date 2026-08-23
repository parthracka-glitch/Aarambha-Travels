import { Response } from 'express';
import { EventEmitter } from 'events';

class RealtimeService extends EventEmitter {
  private clients: Set<Response> = new Set();

  constructor() {
    super();
    this.setMaxListeners(200);
  }

  addClient(res: Response): void {
    this.clients.add(res);
    res.on('close', () => {
      this.clients.delete(res);
    });
  }

  broadcast(eventType: string, data: any = {}): void {
    const payload = JSON.stringify({ type: eventType, data, timestamp: Date.now() });
    const sseMessage = `data: ${payload}\n\n`;

    for (const client of this.clients) {
      try {
        client.write(sseMessage);
      } catch (_err) {
        this.clients.delete(client);
      }
    }

    this.emit(eventType, data);
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const realtimeService = new RealtimeService();
