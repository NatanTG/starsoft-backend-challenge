import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, CanActivate } from '@nestjs/common';
import { ListUserOrdersController } from './list-user-orders.controller';
import { ListUserOrdersService } from '@/modules/orders/application/services/list-user-orders/list-user-orders.service';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

class MockListUserOrdersService {
  async execute(payload: any): Promise<any> {
    if (payload.userId === 'not-found') {
      throw new BadRequestException('User not found.');
    }
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

class MockAuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

describe('ListUserOrdersController', () => {
  let controller: ListUserOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListUserOrdersController],
      providers: [
        { provide: ListUserOrdersService, useClass: MockListUserOrdersService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<ListUserOrdersController>(ListUserOrdersController);
  });

  it('should list user orders successfully', async () => {
    const query = { page: 1, limit: 10, offset: 0 };

    const result = await controller.listUserOrders('user-123', query);

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        total: expect.any(Number),
      }),
    );
  });

  it('should handle service errors', async () => {
    const query = { page: 1, limit: 10, offset: 0 };

    await expect(
      controller.listUserOrders('not-found', query),
    ).rejects.toThrow(BadRequestException);
  });
});
