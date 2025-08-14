import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateOrderService } from './update-order.service';
import { MockOrderRepository } from '../../../../../../test/mocks/mock-order-repository';
import { MockKafkaService } from '../../../../../../test/mocks/mock-kafka-service';
import { MockElasticsearchService } from '../../../../../../test/mocks/mock-elasticsearch.service';
import { MockLogger } from '../../../../../../test/mocks/mock-logger';
import { MyLogger } from '@/shared/services/logger/structured-logger.service';

describe('UpdateOrderService', () => {
  let service: UpdateOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderService,
        { provide: 'OrderRepository', useClass: MockOrderRepository },
        { provide: 'KafkaService', useClass: MockKafkaService },
        { provide: 'ElasticsearchService', useClass: MockElasticsearchService },
        { provide: MyLogger, useClass: MockLogger },
      ],
    }).compile();

    service = module.get<UpdateOrderService>(UpdateOrderService);
  });

  it('should update order successfully', async () => {
    const request: UpdateOrderService.Request = {
      id: 'order-123',
      status: 'processing',
    };

    const result = await service.execute(request);

    expect(result).toEqual(
      expect.objectContaining({
        id: 'order-123',
        status: expect.any(String),
      }),
    );
  });

  it('should throw NotFoundException when order not found', async () => {
    const request: UpdateOrderService.Request = {
      id: 'not-found-id',
      status: 'processing',
    };

    await expect(service.execute(request)).rejects.toThrow(NotFoundException);
  });
});