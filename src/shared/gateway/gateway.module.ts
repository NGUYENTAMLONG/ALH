import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MyGateway } from './gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [MyGateway, JwtService, SocketService],
})
export class GatewayModule {}
