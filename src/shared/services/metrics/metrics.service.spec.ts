import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';

jest.mock('prom-client', () => {
  const mockMetrics = jest.fn().mockResolvedValue('mocked metrics');
  const mockInc = jest.fn();
  const mockObserve = jest.fn();
  const mockSet = jest.fn();

  return {
    register: {
      metrics: mockMetrics,
      clear: jest.fn(),
    },
    Counter: jest.fn().mockImplementation(() => ({
      inc: mockInc,
    })),
    Histogram: jest.fn().mockImplementation(() => ({
      observe: mockObserve,
    })),
    Gauge: jest.fn().mockImplementation(() => ({
      set: mockSet,
    })),
    collectDefaultMetrics: jest.fn(),
  };
});

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  it('should get metrics successfully', async () => {
    const result = await service.getMetrics();

    expect(result).toBe('mocked metrics');
  });

  it('should increment HTTP requests', () => {
    expect(() => {
      service.incrementHttpRequests('GET', '/api/test', 200);
    }).not.toThrow();
  });

  it('should observe HTTP duration', () => {
    expect(() => {
      service.observeHttpDuration('POST', '/api/test', 1.5);
    }).not.toThrow();
  });
});