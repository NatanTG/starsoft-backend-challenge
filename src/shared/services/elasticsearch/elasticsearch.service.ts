import { PaginatedResult } from '@/shared/types/pagination.types';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';

export abstract class ElasticsearchService {
  abstract indexDocument(request: ElasticsearchService.IndexDocumentRequest): Promise<ElasticsearchService.IndexDocumentResponse>;
  abstract updateDocument(request: ElasticsearchService.UpdateDocumentRequest): Promise<ElasticsearchService.UpdateDocumentResponse>;
  abstract deleteDocument(request: ElasticsearchService.DeleteDocumentRequest): Promise<ElasticsearchService.DeleteDocumentResponse>;
  abstract search(request: ElasticsearchService.SearchRequest): Promise<ElasticsearchService.SearchResponse>;
  abstract createIndex(request: ElasticsearchService.CreateIndexRequest): Promise<ElasticsearchService.CreateIndexResponse>;
  abstract indexExists(request: ElasticsearchService.IndexExistsRequest): Promise<ElasticsearchService.IndexExistsResponse>;
  abstract searchOrders(request: ElasticsearchService.SearchOrdersRequest): Promise<ElasticsearchService.SearchOrdersResponse>;
}

export namespace ElasticsearchService {
  export type IndexDocumentRequest = {
    index: string;
    id: string;
    document: any;
  };

  export type UpdateDocumentRequest = {
    index: string;
    id: string;
    document: any;
  };

  export type DeleteDocumentRequest = {
    index: string;
    id: string;
  };

  export type SearchRequest = {
    index: string;
    query: any;
  };

  export type CreateIndexRequest = {
    index: string;
    mapping?: any;
  };

  export type IndexExistsRequest = {
    index: string;
  };

  export type IndexDocumentResponse = void;
  export type UpdateDocumentResponse = void;
  export type DeleteDocumentResponse = void;
  export type CreateIndexResponse = void;
  export type IndexExistsResponse = boolean;

  export type SearchResponse = {
    hits: {
      hits: any[];
      total: number | { value: number };
    };
  };

  export type SearchOrdersRequest = {
    page: number;
    limit: number;
    offset: number;
    orderId?: string;
    status?: OrderStatus;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    productName?: string;
  };
  
  export type OrderSearchItem = {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    items: OrderItemSearchResult[];
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  
  export type OrderItemSearchResult = {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  };
  
  export type SearchOrdersResponse = PaginatedResult<OrderSearchItem>;
}