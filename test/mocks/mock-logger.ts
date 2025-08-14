import { MyLogger } from '@/shared/services/logger/structured-logger.service';

export class MockLogger extends MyLogger {
  private logSpy = jest.fn();
  private errorSpy = jest.fn();
  private warnSpy = jest.fn();
  private debugSpy = jest.fn();
  private verboseSpy = jest.fn();
  private fatalSpy = jest.fn();
  private setContextSpy = jest.fn();

  setContext(context: string) {
    this.setContextSpy(context);
  }

  log(message: any, ...optionalParams: any[]) {
    this.logSpy(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.errorSpy(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.warnSpy(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.debugSpy(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.verboseSpy(message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.fatalSpy(message, ...optionalParams);
  }

  getLogSpy() {
    return this.logSpy;
  }

  getErrorSpy() {
    return this.errorSpy;
  }

  getWarnSpy() {
    return this.warnSpy;
  }

  getDebugSpy() {
    return this.debugSpy;
  }

  getVerboseSpy() {
    return this.verboseSpy;
  }

  getFatalSpy() {
    return this.fatalSpy;
  }

  getSetContextSpy() {
    return this.setContextSpy;
  }

  resetSpies() {
    this.logSpy.mockReset();
    this.errorSpy.mockReset();
    this.warnSpy.mockReset();
    this.debugSpy.mockReset();
    this.verboseSpy.mockReset();
    this.fatalSpy.mockReset();
    this.setContextSpy.mockReset();
  }
}