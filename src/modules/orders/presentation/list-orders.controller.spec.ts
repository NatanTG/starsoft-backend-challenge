import { Test, TestingModule } from '@nestjs/testing';
import { ListOrdersController } from './list-orders.controller';
import { ListOrdersService } from '@/modules/orders/application/services/list-orders/list-orders.service';

class MockListOrdersService {
  async execute(): Promise<any> {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

describe('ListOrdersController', () => {
  let controller: ListOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListOrdersController],
      providers: [
        { provide: ListOrdersService, useClass: MockListOrdersService },
      ],
    }).compile();

    controller = module.get<ListOrdersController>(ListOrdersController);
  });

  it('should list orders successfully', async () => {
    const query = { page: 1, limit: 10, offset: 0 };

    const result = await controller.listOrders(query);

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        total: expect.any(Number),
      }),
    );
  });
});