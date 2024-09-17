// Nest dependencies
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Other dependencies
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as dayjs from 'dayjs';
import helmet from 'helmet';

// Add plugin dependencies
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone UTC+7
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

// Local files
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { configService } from './shared/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set default timezone for the application
  dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

  app.enableCors();

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(compression());

  app.use(cookieParser());

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Alehub')
    .setDescription('The Alehub API description')
    .setVersion('1.0')
    .addTag('Alehub')
    .addSecurity('token', {
      type: 'apiKey',
      in: 'header',
      name: 'token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document);

  await app.listen(configService.getPortApplication());

  console.log(`PORT ${configService.getPortApplication()}/api`);
}
bootstrap();
