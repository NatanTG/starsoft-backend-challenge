import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderService } from '@/modules/orders/application/services/create-order/create-order.service';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

class MockCreateOrderService {
  async execute(payload: any): Promise<any> {
    if (payload.userId === 'invalid-user') {
      throw new BadRequestException('User not found.');
    }
    return { id: 'order-123', userId: payload.userId, status: 'pending' };
  }
}

class MockAuthGuard {
  canActivate(): boolean {
    return true;
  }
}

describe('CreateOrderController', () => {
  let controller: CreateOrderController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [CreateOrderController],
      providers: [
        { provide: CreateOrderService, useClass: MockCreateOrderService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<CreateOrderController>(CreateOrderController);
  });

  it('should create order successfully', async () => {
    const payload = { items: [{ productId: 'product-1', quantity: 2 }] };
    const req = { user: { id: 'user-123' } };

    const mockService = module.get<CreateOrderService>(CreateOrderService);
    const executeSpy = jest.spyOn(mockService, 'execute');

    const result = await controller.createOrder(payload, req);

    expect(executeSpy).toHaveBeenCalledWith({
      userId: 'user-123',
      items: [{ productId: 'product-1', quantity: 2 }],
    });
    expect(result).toBeUndefined();
  });

  it('should handle service errors', async () => {
    const payload = { items: [{ productId: 'product-1', quantity: 1 }] };
    const req = { user: { id: 'invalid-user' } };

    await expect(controller.createOrder(payload, req)).rejects.toThrow(BadRequestException);
  });
});