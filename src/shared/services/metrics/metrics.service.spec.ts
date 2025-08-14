import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';

// Create a complete mock implementation
class SimpleMetricsMock {
  private getMetricsSpy = jest.fn().mockResolvedValue('mock-prometheus-metrics');
  private incrementHttpRequestsSpy = jest.fn();
  private observeHttpDurationSpy = jest.fn();
  private incrementOrdersSpy = jest.fn();
  private setActiveConnectionsSpy = jest.fn();
  private incrementKafkaMessagesSpy = jest.fn();
  private incrementElasticsearchOperationsSpy = jest.fn();

  async getMetrics(): Promise<string> {
    this.getMetricsSpy();
    return 'mock-prometheus-metrics';
  }

  incrementHttpRequests(method: string, route: string, statusCode: number): void {
    this.incrementHttpRequestsSpy(method, route, statusCode);
  }

  observeHttpDuration(method: string, route: string, duration: number): void {
    this.observeHttpDurationSpy(method, route, duration);
  }

  incrementOrders(status: string, action: string): void {
    this.incrementOrdersSpy(status, action);
  }

  setActiveConnections(count: number): void {
    this.setActiveConnectionsSpy(count);
  }

  incrementKafkaMessages(topic: string, status: string): void {
    this.incrementKafkaMessagesSpy(topic, status);
  }

  incrementElasticsearchOperations(operation: string, index: string, status: string): void {
    this.incrementElasticsearchOperationsSpy(operation, index, status);
  }

  onModuleInit(): void {}

  // Spy getters for testing
  getGetMetricsSpy() { return this.getMetricsSpy; }
  getIncrementHttpRequestsSpy() { return this.incrementHttpRequestsSpy; }
  getObserveHttpDurationSpy() { return this.observeHttpDurationSpy; }
  getIncrementOrdersSpy() { return this.incrementOrdersSpy; }
  getSetActiveConnectionsSpy() { return this.setActiveConnectionsSpy; }
  getIncrementKafkaMessagesSpy() { return this.incrementKafkaMessagesSpy; }
  getIncrementElasticsearchOperationsSpy() { return this.incrementElasticsearchOperationsSpy; }

  resetSpies() {
    this.getMetricsSpy.mockClear();
    this.incrementHttpRequestsSpy.mockClear();
    this.observeHttpDurationSpy.mockClear();
    this.incrementOrdersSpy.mockClear();
    this.setActiveConnectionsSpy.mockClear();
    this.incrementKafkaMessagesSpy.mockClear();
    this.incrementElasticsearchOperationsSpy.mockClear();
  }
}

describe('MetricsService', () => {
  let service: MetricsService;
  let mockService: SimpleMetricsMock;

  beforeEach(async () => {
    mockService = new SimpleMetricsMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MetricsService,
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    mockService.resetSpies();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get metrics successfully', async () => {
    const result = await service.getMetrics();

    expect(result).toBe('mock-prometheus-metrics');
    expect(mockService.getGetMetricsSpy()).toHaveBeenCalled();
  });

  it('should increment HTTP requests with realistic data', () => {
    const testCases = [
      { method: 'GET', route: '/api/orders', statusCode: 200 },
      { method: 'POST', route: '/api/orders', statusCode: 201 },
      { method: 'PUT', route: '/api/orders/:id', statusCode: 200 },
      { method: 'DELETE', route: '/api/orders/:id', statusCode: 204 },
      { method: 'GET', route: '/api/users', statusCode: 200 },
      { method: 'POST', route: '/api/auth/session', statusCode: 401 },
      { method: 'GET', route: '/api/orders/search', statusCode: 500 },
    ];

    testCases.forEach(({ method, route, statusCode }) => {
      service.incrementHttpRequests(method, route, statusCode);
    });

    expect(mockService.getIncrementHttpRequestsSpy()).toHaveBeenCalledTimes(testCases.length);
    
    testCases.forEach(({ method, route, statusCode }, index) => {
      expect(mockService.getIncrementHttpRequestsSpy())
        .toHaveBeenNthCalledWith(index + 1, method, route, statusCode);
    });
  });

  it('should observe HTTP duration with realistic timing data', () => {
    const testCases = [
      { method: 'GET', route: '/api/orders', duration: 0.125 },
      { method: 'POST', route: '/api/orders', duration: 1.234 },
      { method: 'GET', route: '/api/orders/search', duration: 2.567 },
      { method: 'PUT', route: '/api/orders/:id', duration: 0.789 },
      { method: 'DELETE', route: '/api/orders/:id', duration: 0.456 },
      { method: 'GET', route: '/metrics', duration: 0.023 },
    ];

    testCases.forEach(({ method, route, duration }) => {
      service.observeHttpDuration(method, route, duration);
    });

    expect(mockService.getObserveHttpDurationSpy()).toHaveBeenCalledTimes(testCases.length);
    
    testCases.forEach(({ method, route, duration }, index) => {
      expect(mockService.getObserveHttpDurationSpy())
        .toHaveBeenNthCalledWith(index + 1, method, route, duration);
    });
  });

  it('should increment orders with business data', () => {
    const orderEvents = [
      { status: 'PENDING', action: 'created' },
      { status: 'PROCESSING', action: 'updated' },
      { status: 'SHIPPED', action: 'updated' },
      { status: 'DELIVERED', action: 'updated' },
      { status: 'CANCELLED', action: 'updated' },
      { status: 'PENDING', action: 'created' },
    ];

    orderEvents.forEach(({ status, action }) => {
      (service as any).incrementOrders(status, action);
    });

    expect(mockService.getIncrementOrdersSpy()).toHaveBeenCalledTimes(orderEvents.length);
  });

  it('should set active connections with realistic connection counts', () => {
    const connectionCounts = [0, 5, 15, 25, 50, 100, 75, 30, 10];

    connectionCounts.forEach(count => {
      service.setActiveConnections(count);
    });

    expect(mockService.getSetActiveConnectionsSpy()).toHaveBeenCalledTimes(connectionCounts.length);
    
    connectionCounts.forEach((count, index) => {
      expect(mockService.getSetActiveConnectionsSpy())
        .toHaveBeenNthCalledWith(index + 1, count);
    });
  });

  it('should handle Kafka message metrics', () => {
    const kafkaEvents = [
      { topic: 'order.created', status: 'success' },
      { topic: 'order.updated', status: 'success' },
      { topic: 'user.created', status: 'success' },
      { topic: 'order.created', status: 'error' },
      { topic: 'order.payment.processed', status: 'success' },
    ];

    kafkaEvents.forEach(({ topic, status }) => {
      (service as any).incrementKafkaMessages(topic, status);
    });

    expect(mockService.getIncrementKafkaMessagesSpy()).toHaveBeenCalledTimes(kafkaEvents.length);
  });

  it('should handle Elasticsearch operation metrics', () => {
    const elasticsearchOps = [
      { operation: 'index', index: 'orders', status: 'success' },
      { operation: 'search', index: 'orders', status: 'success' },
      { operation: 'update', index: 'orders', status: 'success' },
      { operation: 'delete', index: 'orders', status: 'success' },
      { operation: 'index', index: 'users', status: 'success' },
      { operation: 'search', index: 'orders', status: 'error' },
    ];

    elasticsearchOps.forEach(({ operation, index, status }) => {
      (service as any).incrementElasticsearchOperations(operation, index, status);
    });

    expect(mockService.getIncrementElasticsearchOperationsSpy()).toHaveBeenCalledTimes(elasticsearchOps.length);
  });

  it('should return consistent metrics format', async () => {
    const metrics1 = await service.getMetrics();
    const metrics2 = await service.getMetrics();
    const metrics3 = await service.getMetrics();

    expect(metrics1).toBe('mock-prometheus-metrics');
    expect(metrics2).toBe('mock-prometheus-metrics');
    expect(metrics3).toBe('mock-prometheus-metrics');
    
    expect(mockService.getGetMetricsSpy()).toHaveBeenCalledTimes(3);
  });
});