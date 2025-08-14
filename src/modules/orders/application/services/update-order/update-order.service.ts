import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';
import { KafkaService } from '@/shared/services/kafka/kafka.service';
import { ElasticsearchService } from '@/shared/services/elasticsearch/elasticsearch.service';
import { ELASTICSEARCH_INDEXES } from '@/core/config/elasticsearch.config';
import { MyLogger } from '@/shared/services/logger/structured-logger.service';

@Injectable()
export class UpdateOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,

    @Inject('KafkaService')
    private readonly kafkaService: KafkaService,

    @Inject('ElasticsearchService')
    private readonly elasticsearchService: ElasticsearchService,

    private readonly logger: MyLogger,
  ) {
    this.logger.setContext(UpdateOrderService.name);
  }

  async execute(
    payload: UpdateOrderService.Request,
  ): Promise<UpdateOrderService.Response> {
    const existingOrder = await this.orderRepository.findById(payload.id);

    if (!existingOrder) {
      throw new NotFoundException('Order not found.');
    }

    if (
      payload.status &&
      !Object.values(OrderStatus).includes(payload.status as OrderStatus)
    ) {
      throw new BadRequestException('Invalid order status.');
    }

    const updateData: Partial<OrderEntity> = {};
    if (payload.status) updateData.status = payload.status as OrderStatus;

    await this.orderRepository.update(payload.id, updateData);

    const updatedOrder = await this.orderRepository.findById(payload.id);

    if (!updatedOrder) {
      throw new NotFoundException('Order not found after update.');
    }

    const orderEventData = this.createOrderEventData(updatedOrder);
    const orderUpdateDocument = this.createOrderUpdateDocument(updatedOrder);

    const asyncOperations = await Promise.allSettled([
      this.kafkaService.publish({
        topic: KafkaService.TOPICS.ORDER_UPDATED,
        message: orderEventData
      }),
      this.elasticsearchService.updateDocument({
        index: ELASTICSEARCH_INDEXES.ORDERS,
        id: updatedOrder.id,
        document: orderUpdateDocument
      }),
    ]);

    asyncOperations.forEach((result, index) => {
      if (result.status === 'rejected') {
        const operation = index === 0 ? 'Kafka publish' : 'Elasticsearch update';
        this.logger.error({
          message: `Failed to ${operation} order`,
          orderId: updatedOrder.id,
          userId: updatedOrder.userId,
          error: result.reason?.message || 'Unknown error',
          stack: result.reason?.stack,
        });
      }
    });

    return {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      status: updatedOrder.status,
      totalAmount: updatedOrder.totalAmount,
      items: updatedOrder.items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString(),
    };
  }

  private createOrderEventData(order: OrderEntity): KafkaService.OrderEventData {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private createOrderUpdateDocument(order: OrderEntity) {
    return {
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      updatedAt: order.updatedAt,
    };
  }
}

export namespace UpdateOrderService {
  export type Request = {
    id: string;
    status?: string;
  };

  export type Response = {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    items: {
      id: string;
      productName: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}
