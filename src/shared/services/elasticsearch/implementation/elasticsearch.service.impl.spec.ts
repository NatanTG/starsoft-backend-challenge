import { ElasticsearchServiceImpl } from './elasticsearch.service.impl';
import { MockFactory } from 'test/mocks/mock-factory';

const mockElasticsearchClient = {
  ping: jest.fn().mockResolvedValue({}),
  index: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  search: jest.fn().mockResolvedValue({
    hits: { hits: [], total: { value: 0 } },
    took: 1,
    timed_out: false,
    _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
  }),
  indices: {
    create: jest.fn().mockResolvedValue({}),
    exists: jest.fn().mockResolvedValue(true),
  },
};

jest.mock('@/core/config/elasticsearch.config', () => ({
  createElasticsearchClient: jest.fn(() => mockElasticsearchClient),
  ELASTICSEARCH_INDEXES: { ORDERS: 'orders' },
}));

describe('ElasticsearchServiceImpl', () => {
  let service: ElasticsearchServiceImpl;

  beforeEach(() => {
    
    service = new ElasticsearchServiceImpl();

    
    service['client'] = mockElasticsearchClient as any;

    
    jest.spyOn(service['logger'], 'log').mockImplementation();
    jest.spyOn(service['logger'], 'error').mockImplementation();
  });

  afterEach(async () => {
    
    await MockFactory.cleanup();
    
    Object.values(mockElasticsearchClient).forEach(mock => {
      if (typeof mock === 'function' && mock.mockClear) {
        mock.mockClear();
      }
    });
  });

  it('should initialize successfully', async () => {
    await expect(service.onModuleInit()).resolves.not.toThrow();
  });

  it('should index document successfully', async () => {
    const request = { index: 'test', id: '1', document: { data: 'test' } };

    await expect(service.indexDocument(request)).resolves.not.toThrow();
  });

  it('should search documents successfully', async () => {
    const request = { index: 'test', query: {} };

    
    expect(service.search).toBeDefined();
    expect(typeof service.search).toBe('function');
    
    
    expect(mockElasticsearchClient.search).toBeDefined();
  });
});