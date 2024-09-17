import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  private sockets: Set<string> = new Set();

  addSocket(id: string): void {
    this.sockets.add(id);
  }

  removeSocket(id: string): void {
    this.sockets.delete(id);
  }

  getSockets(): string[] {
    return Array.from(this.sockets);
  }
}
