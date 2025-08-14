import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics/metrics.service';
import { MyLogger } from '../services/logger/structured-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(MetricsService)
    private readonly metricsService: MetricsService,
    private readonly logger: MyLogger,
  ) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, headers, body, query, params } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    this.logger.log({
      message: 'Incoming request',
      method,
      url,
      userAgent,
      query,
      params,
      body: this.sanitizeBody(body),
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    });

    return next.handle().pipe(
      tap(data => {
        const duration = Date.now() - startTime;

        this.metricsService.incrementHttpRequests(
          method,
          url,
          response.statusCode,
        );
        this.metricsService.observeHttpDuration(method, url, duration / 1000);

        this.logger.log({
          message: 'Request completed',
          method,
          url,
          statusCode: response.statusCode,
          duration,
          responseSize: data ? JSON.stringify(data).length : 0,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError(error => {
        const duration = Date.now() - startTime;

        this.metricsService.incrementHttpRequests(
          method,
          url,
          error.status || 500,
        );
        this.metricsService.observeHttpDuration(method, url, duration / 1000);

        this.logger.error({
          message: 'Request failed',
          method,
          url,
          statusCode: error.status || 500,
          duration,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          timestamp: new Date().toISOString(),
        });

        throw error;
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
