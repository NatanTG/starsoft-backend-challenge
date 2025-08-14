import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteOrderService } from './delete-order.service';
import { MockOrderRepository } from '../../../../../../test/mocks/mock-order-repository';
import { MockElasticsearchService } from '../../../../../../test/mocks/mock-elasticsearch.service';
import { MockLogger } from '../../../../../../test/mocks/mock-logger';
import { MyLogger } from '@/shared/services/logger/structured-logger.service';

describe('DeleteOrderService', () => {
  let service: DeleteOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteOrderService,
        { provide: 'OrderRepository', useClass: MockOrderRepository },
        { provide: 'ElasticsearchService', useClass: MockElasticsearchService },
        { provide: MyLogger, useClass: MockLogger },
      ],
    }).compile();

    service = module.get<DeleteOrderService>(DeleteOrderService);
  });

  it('should delete order successfully', async () => {
    const request: DeleteOrderService.Request = { id: 'order-123' };

    const result = await service.execute(request);

    expect(result).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it('should throw NotFoundException when order not found', async () => {
    const request: DeleteOrderService.Request = { id: 'not-found-id' };

    await expect(service.execute(request)).rejects.toThrow(NotFoundException);
  });
});