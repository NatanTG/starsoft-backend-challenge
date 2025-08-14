import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  register,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly ordersTotal: Counter<string>;
  private readonly activeConnections: Gauge<string>;
  private readonly kafkaMessagesTotal: Counter<string>;
  private readonly elasticsearchOperationsTotal: Counter<string>;

  constructor() {
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    });

    this.ordersTotal = new Counter({
      name: 'orders_total',
      help: 'Total number of orders',
      labelNames: ['status', 'action'],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    this.kafkaMessagesTotal = new Counter({
      name: 'kafka_messages_total',
      help: 'Total number of Kafka messages',
      labelNames: ['topic', 'status'],
    });

    this.elasticsearchOperationsTotal = new Counter({
      name: 'elasticsearch_operations_total',
      help: 'Total number of Elasticsearch operations',
      labelNames: ['operation', 'index', 'status'],
    });
  }

  onModuleInit() {
    collectDefaultMetrics({ register });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  observeHttpDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  incrementOrders(status: string, action: 'created' | 'updated' | 'deleted') {
    this.ordersTotal.inc({ status, action });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  incrementKafkaMessages(topic: string, status: 'success' | 'error') {
    this.kafkaMessagesTotal.inc({ topic, status });
  }

  incrementElasticsearchOperations(
    operation: string,
    index: string,
    status: 'success' | 'error',
  ) {
    this.elasticsearchOperationsTotal.inc({ operation, index, status });
  }

  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
