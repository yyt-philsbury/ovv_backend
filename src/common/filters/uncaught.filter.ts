import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';
/**
 * This exception handler is invoked for all uncaught exceptions - non HTTP exceptions or uncaught exceptions.
 */
@Catch()
export class UncaughtExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: CustomWinstonLogger) {
    super();
    logger.setContext(UncaughtExceptionFilter.name);
  }

  printRouteInfo(request: FastifyRequest) {
    this.logger.error(`${request.method}: ${request.routerPath}`);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    this.printRouteInfo(request);
    if (exception instanceof Error) {
      this.logger.error(exception);
    } else {
      this.logger.error(`Non-error thrown: ${exception}`);
    }

    response.status(500).send('Internal Server Error');
  }
}

