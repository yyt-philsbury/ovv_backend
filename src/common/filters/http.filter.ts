import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
/**
 * Handles when all generic HTTP errors thrown, the only use case for this
 * (so far) is for BadRequestExceptions which are thrown by class-validator
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(exception.getStatus()).send(exception.getResponse());
  }
}

