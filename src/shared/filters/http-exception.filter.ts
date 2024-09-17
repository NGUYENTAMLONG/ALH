import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message =
      Array.isArray(exception?.response?.message) &&
      exception?.response?.message.length > 0
        ? exception?.response.message[0]
        : exception.message;

    response.status(status).json({
      status: 0,
      code: status,
      msg: message,
      data: {},
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
