// Nest dependencies
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';

// Other dependencies
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const trimRequest = require('trim-request');

// Local files
import { AuthGuard } from '@guards/auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { configService } from '@services/config.service';
import { configSequelize } from '@services/sequelize.config';
import { GatewayModule } from './shared/gateway/gateway.module';
import { TasksModule } from './tasks/task.module';
import { V1Module } from './v1/v1.module';
import { PdfMiddleware } from '@middlewares/pdf.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    JwtModule.register(configService.getJwtConfig()),
    SequelizeModule.forRoot(configSequelize.getSequelizeConfig()),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: '/public',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
      serveRoot: '/public',
    }),
    V1Module,
    GatewayModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(trimRequest.all).forRoutes('*');

    consumer
      .apply(PdfMiddleware)
      .forRoutes({ path: 'public/files/:fileName', method: RequestMethod.GET });
  }
}
