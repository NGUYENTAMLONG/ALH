import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { configService } from '@services/config.service';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class MyGateway implements OnModuleInit, OnGatewayConnection {
  constructor(
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
  ) {}

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
      this.socketService.addSocket(socket.id);
      this.server.emit('socket-id', {
        msg: {
          socket_id: socket.id,
        },
      });
      // console.log({ a: this.socketService.getSockets() });
    });
  }

  async handleConnection(socket: Socket) {
    try {
      const payload = await this.jwtService.verifyAsync(
        socket.handshake.auth.token,
        {
          secret: configService.getEnv('JWT_SECRET'),
        },
      );
      socket.handshake.auth.user = payload;

      if (payload) {
        socket.join(`user_id_${payload.id}`);
      }
    } catch (error) {
      socket.handshake.auth.user = null;
    }
  }

  emitEvent(@MessageBody() data: any, channel: string) {
    this.server.emit(channel, {
      msg: data,
    });
  }

  emitLoginSuccess(socketId: string, data: any) {
    this.server.to(socketId).emit('login-success', data);
  }

  emitLoginFailure(socketId: string, data: any) {
    this.server.to(socketId).emit('login-fail', data);
  }
}
