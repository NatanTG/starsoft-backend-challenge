import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import { ElasticsearchService } from '@/shared/services/elasticsearch/elasticsearch.service';
import { ELASTICSEARCH_INDEXES } from '@/core/config/elasticsearch.config';
import { MyLogger } from '@/shared/services/logger/structured-logger.service';

@Injectable()
export class DeleteOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,

    @Inject('ElasticsearchService')
    private readonly elasticsearchService: ElasticsearchService,

    private readonly logger: MyLogger,
  ) {
    this.logger.setContext(DeleteOrderService.name);
  }

  async execute(
    payload: DeleteOrderService.Request,
  ): Promise<DeleteOrderService.Response> {
    try {
      const order = await this.orderRepository.findById(payload.id);

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      await this.orderRepository.delete(payload.id);

      this.elasticsearchService.deleteDocument({
        index: ELASTICSEARCH_INDEXES.ORDERS,
        id: payload.id
      })
        .catch(error => {
          this.logger.error({
            message: 'Failed to delete order from Elasticsearch',
            orderId: payload.id,
            error: error.message,
            stack: error.stack,
          });
        });

      this.logger.log({
        message: 'Order deleted successfully',
        orderId: payload.id,
      });

      return {
        message: 'Order deleted successfully.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error({
        message: 'Failed to delete order',
        orderId: payload.id,
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  }
}

export namespace DeleteOrderService {
  export type Request = {
    id: string;
  };

  export type Response = {
    message: string;
  };
}
