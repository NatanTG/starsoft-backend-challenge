import { Test, TestingModule } from '@nestjs/testing';
import { ListOrdersService } from './list-orders.service';
import { MockOrderRepository } from '../../../../../../test/mocks/mock-order-repository';

describe('ListOrdersService', () => {
  let service: ListOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListOrdersService,
        { provide: 'OrderRepository', useClass: MockOrderRepository },
      ],
    }).compile();

    service = module.get<ListOrdersService>(ListOrdersService);
  });

  it('should list orders successfully', async () => {
    const request: ListOrdersService.Request = {
      page: 1,
      limit: 10,
      offset: 0,
    };

    const result = await service.execute(request);

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        limit: 10,
      }),
    );
  });
});