import { Test, TestingModule } from '@nestjs/testing';
import { SearchOrdersController } from './search-orders.controller';
import { SearchOrdersService } from '@/modules/orders/application/services/search-orders/search-orders.service';

class MockSearchOrdersService {
  async execute(): Promise<any> {
    return { orders: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

describe('SearchOrdersController', () => {
  let controller: SearchOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchOrdersController],
      providers: [
        { provide: SearchOrdersService, useClass: MockSearchOrdersService },
      ],
    }).compile();

    controller = module.get<SearchOrdersController>(SearchOrdersController);
  });

  it('should search orders successfully', async () => {
    const query = { page: 1, limit: 10, offset: 0 };

    const result = await controller.searchOrders(query);

    expect(result).toEqual(
      expect.objectContaining({
        orders: expect.any(Array),
        total: expect.any(Number),
      }),
    );
  });
});