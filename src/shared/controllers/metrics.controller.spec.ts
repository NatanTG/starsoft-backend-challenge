import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from '../services/metrics/metrics.service';

class MockMetricsService {
  async getMetrics(): Promise<string> {
    return 'mocked prometheus metrics';
  }
}

describe('MetricsController', () => {
  let controller: MetricsController;
  let mockMetricsService: MockMetricsService;

  beforeEach(async () => {
    mockMetricsService = new MockMetricsService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return metrics from service', async () => {
      const mockMetrics = '# HELP http_requests_total Total HTTP requests\nhttp_requests_total{method="GET"} 10';
      jest.spyOn(mockMetricsService, 'getMetrics').mockResolvedValue(mockMetrics);

      const result = await controller.getMetrics();

      expect(result).toBe(mockMetrics);
      expect(mockMetricsService.getMetrics).toHaveBeenCalled();
    });

    it('should handle empty metrics', async () => {
      jest.spyOn(mockMetricsService, 'getMetrics').mockResolvedValue('');

      const result = await controller.getMetrics();

      expect(result).toBe('');
    });

    it('should propagate service errors', async () => {
      jest.spyOn(mockMetricsService, 'getMetrics').mockRejectedValue(new Error('Service error'));

      await expect(controller.getMetrics()).rejects.toThrow('Service error');
    });
  });
});