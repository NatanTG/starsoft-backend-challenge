import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, CanActivate } from '@nestjs/common';
import { DeleteOrderController } from './delete-order.controller';
import { DeleteOrderService } from '@/modules/orders/application/services/delete-order/delete-order.service';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

class MockDeleteOrderService {
  async execute(payload: any): Promise<any> {
    if (payload.id === 'not-found') {
      throw new NotFoundException('Order not found.');
    }
    return { message: 'Order deleted successfully.' };
  }
}

class MockAuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

describe('DeleteOrderController', () => {
  let controller: DeleteOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteOrderController],
      providers: [
        { provide: DeleteOrderService, useClass: MockDeleteOrderService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<DeleteOrderController>(DeleteOrderController);
  });

  it('should delete order successfully', async () => {
    const result = await controller.deleteOrder('order-123');

    expect(result).toEqual(
      expect.objectContaining({
        message: 'Order deleted successfully.',
      }),
    );
  });

  it('should handle service errors', async () => {
    await expect(controller.deleteOrder('not-found')).rejects.toThrow(
      NotFoundException,
    );
  });
});
