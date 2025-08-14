import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindOrderService } from './find-order.service';
import { MockOrderRepository } from '../../../../../../test/mocks/mock-order-repository';

describe('FindOrderService', () => {
  let service: FindOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrderService,
        { provide: 'OrderRepository', useClass: MockOrderRepository },
      ],
    }).compile();

    service = module.get<FindOrderService>(FindOrderService);
  });

  it('should return order when found', async () => {
    const request: FindOrderService.Request = { id: 'order-123' };
    const result = await service.execute(request);

    expect(result).toEqual(
      expect.objectContaining({
        id: 'order-123',
        userId: 'user-123',
      }),
    );
  });

  it('should throw NotFoundException when order not found', async () => {
    const request: FindOrderService.Request = { id: 'not-found-id' };

    await expect(service.execute(request)).rejects.toThrow(NotFoundException);
  });
});