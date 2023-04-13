import 'winston-daily-rotate-file';

import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';

const rotateFileTransport = new winston.transports.DailyRotateFile({
  filename: 'log-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '30d',
});

// const consoleTransport = new winston.transports.Console();

const winstonLogger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.printf(info => {
      if (info.stack) {
        return `${new Date(info.timestamp).toString()} ${info.level} ${
          info.stack
        }`;
      } else
        return `${new Date(info.timestamp).toString()} ${info.level} ${
          info.message
        }`;
    }),
  ),
  // transports: [rotateFileTransport, consoleTransport],
  transports: [rotateFileTransport],
});

/**
 * Winston-enabled logger.
 *
 * Console is handled by parent ConsoleLogger. We override each log
 * function to call winston appropriate function
 *
 * All other transports handled by winston.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class CustomWinstonLogger extends ConsoleLogger {
  enableConsoleLogger = true;

  /**
   * Enables or disables nest console logging (to stdout)
   * Enabled by default on dev.
   *
   * Since this provider is transient, other providers can selectively
   * enable / disable for its own logs.
   *
   * @param flag
   */
  setEnableConsoleLogger(flag: boolean) {
    this.enableConsoleLogger = flag;
  }

  log(message: any, context?: string) {
    if (!this.isLevelEnabled('log')) return;
    if (this.enableConsoleLogger) super.log(message, this.context || context);
    winstonLogger.info(`[${this.context || context}] ${message}`);
  }

  error(message: any, stack?: string, context?: string) {
    if (!this.isLevelEnabled('error')) return;
    if (message instanceof Error) {
      const err = message;

      if (this.enableConsoleLogger)
        super.error(message, stack || err.stack, this.context || context);

      err.message = `[${this.context || context}] ${err.message}`;
      winstonLogger.error(err);
    } else {
      super.error(message, stack, this.context || context);
      winstonLogger.error(`[${this.context || context}] ${message}`);
    }
  }

  warn(message: any, context?: string) {
    if (!this.isLevelEnabled('warn')) return;
    if (this.enableConsoleLogger) super.warn(message, this.context || context);
    winstonLogger.warn(`[${this.context || context}] ${message}`);
  }

  debug(message: any, context?: string) {
    if (!this.isLevelEnabled('debug')) return;
    if (this.enableConsoleLogger) super.debug(message, this.context || context);
    winstonLogger.debug(`[${this.context || context}] ${message}`);
  }

  verbose(message: any, context?: string) {
    if (!this.isLevelEnabled('verbose')) return;
    if (this.enableConsoleLogger)
      super.verbose(message, this.context || context);
    winstonLogger.verbose(`[${this.context || context}] ${message}`);
  }
}

