import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindOrderController } from './find-order.controller';
import { FindOrderService } from '@/modules/orders/application/services/find-order/find-order.service';

class MockFindOrderService {
  async execute(payload: any): Promise<any> {
    if (payload.id === 'not-found') {
      throw new NotFoundException('Order not found.');
    }
    return { id: payload.id, userId: 'user-123', status: 'pending' };
  }
}

describe('FindOrderController', () => {
  let controller: FindOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindOrderController],
      providers: [
        { provide: FindOrderService, useClass: MockFindOrderService },
      ],
    }).compile();

    controller = module.get<FindOrderController>(FindOrderController);
  });

  it('should find order successfully', async () => {
    const result = await controller.findOrder('order-123');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'order-123',
        userId: 'user-123',
      }),
    );
  });

  it('should handle service errors', async () => {
    await expect(controller.findOrder('not-found')).rejects.toThrow(NotFoundException);
  });
});