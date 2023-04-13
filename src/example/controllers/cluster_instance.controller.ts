import { Controller, Get } from '@nestjs/common';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

@Controller('v1/example')
export class ExampleClusterController {
  constructor(private readonly logger: CustomWinstonLogger) {
    logger.setContext(ExampleClusterController.name);
  }

  @Get('cluster1')
  throw1() {
    /**
     * PM2 ecosystem.config.js pm2 app name.
     * We use this to determine which instance is the primary -
     * we use the primary instance to run scheduled cron jobs
     *
     * We need to build the app before we use pm2 (deploy* scripts)
     */
    return `current instanceName ${process.env.name}`;
  }
}

