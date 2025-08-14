import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchService } from '../elasticsearch.service';
import {
  createElasticsearchClient,
  ELASTICSEARCH_INDEXES,
} from '@/core/config/elasticsearch.config';

@Injectable()
export class ElasticsearchServiceImpl
  extends ElasticsearchService
  implements OnModuleInit
{
  private readonly logger = new Logger(ElasticsearchServiceImpl.name);
  private client: Client;

  constructor() {
    super();
    this.client = createElasticsearchClient();
  }

  async onModuleInit() {
    await this.ensureConnection();
    await this.createOrdersIndex();
  }

  private async ensureConnection(): Promise<void> {
    try {
      await this.client.ping();
      this.logger.log('Elasticsearch connection established');
    } catch (error) {
      this.logger.error('Failed to connect to Elasticsearch', error);
      throw error;
    }
  }

  private async createOrdersIndex(): Promise<void> {
    try {
      const exists = await this.indexExists({ index: ELASTICSEARCH_INDEXES.ORDERS });
      if (!exists) {
        await this.createIndex({ 
          index: ELASTICSEARCH_INDEXES.ORDERS, 
          mapping: {
          properties: {
            id: { type: 'keyword' },
            userId: { type: 'keyword' },
            status: { type: 'keyword' },
            totalAmount: { type: 'double' },
            items: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                productName: {
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' },
                  },
                },
                quantity: { type: 'integer' },
                price: { type: 'double' },
                subtotal: { type: 'double' },
              },
            },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        }});
        this.logger.log('Orders index created successfully');
      }
    } catch (error) {
      this.logger.error('Failed to create orders index', error);
    }
  }

  async indexDocument(request: ElasticsearchService.IndexDocumentRequest): Promise<ElasticsearchService.IndexDocumentResponse> {
    try {
      await this.client.index({
        index: request.index,
        id: request.id,
        document: request.document,
        refresh: 'wait_for',
      });
      this.logger.debug(`Document indexed in ${request.index} with id: ${request.id}`);
    } catch (error) {
      this.logger.error(`Failed to index document in ${request.index}`, error);
      throw error;
    }
  }

  async updateDocument(request: ElasticsearchService.UpdateDocumentRequest): Promise<ElasticsearchService.UpdateDocumentResponse> {
    try {
      await this.client.update({
        index: request.index,
        id: request.id,
        doc: request.document,
        refresh: 'wait_for',
      });
      this.logger.debug(`Document updated in ${request.index} with id: ${request.id}`);
    } catch (error) {
      this.logger.error(`Failed to update document in ${request.index}`, error);
      throw error;
    }
  }

  async deleteDocument(request: ElasticsearchService.DeleteDocumentRequest): Promise<ElasticsearchService.DeleteDocumentResponse> {
    try {
      await this.client.delete({
        index: request.index,
        id: request.id,
        refresh: 'wait_for',
      });
      this.logger.debug(`Document deleted from ${request.index} with id: ${request.id}`);
    } catch (error) {
      this.logger.error(`Failed to delete document from ${request.index}`, error);
      throw error;
    }
  }

  async search(request: ElasticsearchService.SearchRequest): Promise<ElasticsearchService.SearchResponse> {
    try {
      const response = await this.client.search({
        index: request.index,
        ...request.query,
      });
      return response as ElasticsearchService.SearchResponse;
    } catch (error) {
      this.logger.error(`Search failed in ${request.index}`, error);
      throw error;
    }
  }

  async createIndex(request: ElasticsearchService.CreateIndexRequest): Promise<ElasticsearchService.CreateIndexResponse> {
    try {
      await this.client.indices.create({
        index: request.index,
        mappings: request.mapping,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
      });
      this.logger.log(`Index ${request.index} created successfully`);
    } catch (error) {
      this.logger.error(`Failed to create index ${request.index}`, error);
      throw error;
    }
  }

  async indexExists(request: ElasticsearchService.IndexExistsRequest): Promise<ElasticsearchService.IndexExistsResponse> {
    try {
      const response = await this.client.indices.exists({ index: request.index });
      return response;
    } catch (error) {
      this.logger.error(`Failed to check if index ${request.index} exists`, error);
      return false;
    }
  }

  async searchOrders(request: ElasticsearchService.SearchOrdersRequest): Promise<ElasticsearchService.SearchOrdersResponse> {
    try {
      const query: any = {
        query: {
          bool: {
            must: [],
            filter: [],
          },
        },
        sort: [{ createdAt: { order: 'desc' } }],
        from: (request.page - 1) * request.limit,
        size: request.limit,
      };

      if (request.orderId) {
        query.query.bool.must.push({
          match: { id: request.orderId },
        });
      }

      if (request.status) {
        query.query.bool.filter.push({
          term: { status: request.status },
        });
      }

      if (request.userId) {
        query.query.bool.filter.push({
          term: { userId: request.userId },
        });
      }

      if (request.dateFrom || request.dateTo) {
        const dateRange: any = {};
        if (request.dateFrom) dateRange.gte = request.dateFrom;
        if (request.dateTo) dateRange.lte = request.dateTo;

        query.query.bool.filter.push({
          range: { createdAt: dateRange },
        });
      }

      if (request.productName) {
        query.query.bool.must.push({
          nested: {
            path: 'items',
            query: {
              match: {
                'items.productName': {
                  query: request.productName,
                  fuzziness: 'AUTO',
                },
              },
            },
          },
        });
      }

      if (
        query.query.bool.must.length === 0 &&
        query.query.bool.filter.length === 0
      ) {
        query.query = { match_all: {} };
      }

      const result = await this.client.search({
        index: ELASTICSEARCH_INDEXES.ORDERS,
        ...query,
      });

      const totalHits = typeof result.hits.total === 'number' 
        ? result.hits.total 
        : result.hits.total?.value || 0;

      return {
        data: result.hits.hits.map((hit: any) => hit._source),
        total: totalHits,
        page: request.page,
        limit: request.limit,
        totalPages: Math.ceil(totalHits / request.limit),
      };
    } catch (error) {
      this.logger.error('Failed to search orders', error);
      throw new Error(`Failed to search orders: ${error.message}`);
    }
  }
}
