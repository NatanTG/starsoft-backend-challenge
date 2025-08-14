import { Injectable, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@/shared/services/elasticsearch/elasticsearch.service';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';

@Injectable()
export class SearchOrdersService {
  constructor(
    @Inject('ElasticsearchService')
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async execute(
    payload: SearchOrdersService.Request,
  ): Promise<SearchOrdersService.Response> {
    try {


      const result = await this.elasticsearchService.searchOrders(payload);

      return {
        orders: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      throw new Error(`Failed to search orders: ${error.message}`);
    }
  }
}

export namespace SearchOrdersService {
  export type Request = {
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

  export type Response = {
    orders: OrderSearchItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
