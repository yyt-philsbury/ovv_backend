import { Controller, Get } from '@nestjs/common';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

@Controller('v1/example')
export class ExampleLoggingController {
  constructor(private readonly logger: CustomWinstonLogger) {
    // Need to call this to set the part of the log which identifies the class
    logger.setContext(ExampleLoggingController.name);
  }

  @Get('logging1')
  logging1() {
    this.logger.log('context should be set, and this msg should be seen');
    this.logger.warn('warning test');
    this.logger.debug('debug test');
    this.logger.verbose('verbose test');
    return;
  }

  @Get('logging2')
  logging2() {
    this.logger.error('no stack trace, just msg');

    const err = new Error('can pass in stack trace manually');
    this.logger.error(err, err.stack);

    this.logger.error(new Error('can pass in errors directly'));
    return;
  }
}

