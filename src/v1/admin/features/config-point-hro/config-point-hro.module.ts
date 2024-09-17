import { Module } from '@nestjs/common';
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import { AdminConfigPointHroController } from './controller/config-point-hro.controller';
import { AdminConfigPointHroService } from './service/config-point-hro.service';

@Module({
  controllers: [AdminConfigPointHroController],
  providers: [AdminConfigPointHroService, ConfigPointHroRepository],
})
export class AdminConfigPointHroModule {}
