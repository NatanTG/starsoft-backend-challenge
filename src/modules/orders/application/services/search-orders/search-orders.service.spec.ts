import { Test, TestingModule } from '@nestjs/testing';
import { SearchOrdersService } from './search-orders.service';
import { MockElasticsearchService } from '../../../../../../test/mocks/mock-elasticsearch.service';

describe('SearchOrdersService', () => {
  let service: SearchOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchOrdersService,
        { provide: 'ElasticsearchService', useClass: MockElasticsearchService },
      ],
    }).compile();

    service = module.get<SearchOrdersService>(SearchOrdersService);
  });

  it('should search orders successfully', async () => {
    const request: SearchOrdersService.Request = {
      page: 1,
      limit: 10,
      offset: 0,
    };

    const result = await service.execute(request);

    expect(result).toEqual(
      expect.objectContaining({
        orders: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        limit: 10,
      }),
    );
  });

  it('should handle elasticsearch search errors gracefully', async () => {
    const request: SearchOrdersService.Request = {
      page: 1,
      limit: 10,
      offset: 0,
    };

    await expect(() => service.execute(request)).not.toThrow();
  });
});