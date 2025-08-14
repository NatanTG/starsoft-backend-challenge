import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, CanActivate } from '@nestjs/common';
import { UpdateOrderController } from './update-order.controller';
import { UpdateOrderService } from '@/modules/orders/application/services/update-order/update-order.service';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

class MockUpdateOrderService {
  async execute(payload: any): Promise<any> {
    if (payload.id === 'not-found') {
      throw new NotFoundException('Order not found.');
    }
    return { id: payload.id, status: payload.status || 'pending' };
  }
}

class MockAuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

describe('UpdateOrderController', () => {
  let controller: UpdateOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateOrderController],
      providers: [
        { provide: UpdateOrderService, useClass: MockUpdateOrderService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<UpdateOrderController>(UpdateOrderController);
  });

  it('should update order successfully', async () => {
    const payload = { status: OrderStatus.PROCESSING };

    const result = await controller.updateOrder('order-123', payload);

    expect(result).toEqual(
      expect.objectContaining({
        id: 'order-123',
        status: OrderStatus.PROCESSING,
      }),
    );
  });

  it('should handle service errors', async () => {
    const payload = { status: OrderStatus.PROCESSING };

    await expect(
      controller.updateOrder('not-found', payload),
    ).rejects.toThrow(NotFoundException);
  });
});
