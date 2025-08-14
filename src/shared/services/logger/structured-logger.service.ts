import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    this.writeLog('log', message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.writeLog('fatal', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.writeLog('error', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.writeLog('warn', message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.writeLog('debug', message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.writeLog('verbose', message, ...optionalParams);
  }

  private writeLog(level: string, message: any, ...optionalParams: any[]) {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      context: this.context,
      message:
        typeof message === 'string'
          ? message
          : message.message || 'No message provided',
      pid: process.pid,
    };

    if (typeof message === 'object' && message !== null) {
      Object.assign(logEntry, message);
    }

    if (optionalParams.length > 0) {
      logEntry['additionalData'] = optionalParams;
    }

    const output = JSON.stringify(logEntry);

    switch (level) {
      case 'fatal':
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }
}
