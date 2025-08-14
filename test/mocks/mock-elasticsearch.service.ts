import { ElasticsearchService } from '@/shared/services/elasticsearch/elasticsearch.service';

export class MockElasticsearchService extends ElasticsearchService {
  indexDocumentCalled: boolean = false;
  indexDocumentArgs: any = null;
  
  private indexDocumentSpy = jest.fn();
  private updateDocumentSpy = jest.fn();
  private deleteDocumentSpy = jest.fn();
  private searchSpy = jest.fn();
  private createIndexSpy = jest.fn();
  private indexExistsSpy = jest.fn();
  private searchOrdersSpy = jest.fn();

  async indexDocument(request: ElasticsearchService.IndexDocumentRequest): Promise<ElasticsearchService.IndexDocumentResponse> {
    this.indexDocumentCalled = true;
    this.indexDocumentArgs = request;
    this.indexDocumentSpy(request);
  }

  async updateDocument(request: ElasticsearchService.UpdateDocumentRequest): Promise<ElasticsearchService.UpdateDocumentResponse> {
    this.updateDocumentSpy(request);
  }

  async deleteDocument(request: ElasticsearchService.DeleteDocumentRequest): Promise<ElasticsearchService.DeleteDocumentResponse> {
    this.deleteDocumentSpy(request);
  }

  async search(request: ElasticsearchService.SearchRequest): Promise<ElasticsearchService.SearchResponse> {
    this.searchSpy(request);
    return {
      hits: {
        hits: [],
        total: 0,
      },
    };
  }

  async createIndex(request: ElasticsearchService.CreateIndexRequest): Promise<ElasticsearchService.CreateIndexResponse> {
    this.createIndexSpy(request);
    return;
  }

  async indexExists(request: ElasticsearchService.IndexExistsRequest): Promise<ElasticsearchService.IndexExistsResponse> {
    this.indexExistsSpy(request);
    return true;
  }

  async searchOrders(request: ElasticsearchService.SearchOrdersRequest): Promise<ElasticsearchService.SearchOrdersResponse> {
    this.searchOrdersSpy(request);
    return {
      data: [
        {
          id: 'order-1',
          userId: 'user-123',
          status: 'pending',
          totalAmount: 199.99,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: request.page || 1,
      limit: request.limit || 10,
      totalPages: 1,
    };
  }

  getIndexDocumentSpy() {
    return this.indexDocumentSpy;
  }

  getUpdateDocumentSpy() {
    return this.updateDocumentSpy;
  }

  getDeleteDocumentSpy() {
    return this.deleteDocumentSpy;
  }

  getSearchSpy() {
    return this.searchSpy;
  }

  getCreateIndexSpy() {
    return this.createIndexSpy;
  }

  getIndexExistsSpy() {
    return this.indexExistsSpy;
  }

  getSearchOrdersSpy() {
    return this.searchOrdersSpy;
  }

  resetSpies() {
    this.indexDocumentCalled = false;
    this.indexDocumentArgs = null;
    this.indexDocumentSpy.mockReset();
    this.updateDocumentSpy.mockReset();
    this.deleteDocumentSpy.mockReset();
    this.searchSpy.mockReset();
    this.createIndexSpy.mockReset();
    this.indexExistsSpy.mockReset();
    this.searchOrdersSpy.mockReset();
  }
}