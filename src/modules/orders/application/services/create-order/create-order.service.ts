import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import { OrderItemEntity } from '@/modules/orders/domain/entities/order-item.entity';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';
import { KafkaService } from '@/shared/services/kafka/kafka.service';
import { ElasticsearchService } from '@/shared/services/elasticsearch/elasticsearch.service';
import { ELASTICSEARCH_INDEXES } from '@/core/config/elasticsearch.config';
import { MyLogger } from '@/shared/services/logger/structured-logger.service';

@Injectable()
export class CreateOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('KafkaService')
    private readonly kafkaService: KafkaService,

    @Inject('ElasticsearchService')
    private readonly elasticsearchService: ElasticsearchService,

    private readonly logger: MyLogger,
  ) {
    this.logger.setContext(CreateOrderService.name);
  }

  async execute(
    payload: CreateOrderService.Request,
  ): Promise<CreateOrderService.Response> {
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const order = new OrderEntity();
    order.userId = payload.userId;
    order.status = OrderStatus.PENDING;
    order.items = [];

    // Create order items (Because dont have Estoque Service)
    let totalAmount = 0;
    for (const item of payload.items) {
      const orderItem = new OrderItemEntity();
      // Temporary solution: use productId as productName until real product service is integrated
      orderItem.productName = `Product ${item.productId}`;
      orderItem.quantity = item.quantity;
      // Mock price - in real scenario, this would come from product service
      orderItem.price = 99.99;
      orderItem.subtotal = Math.round((item.quantity * orderItem.price) * 100) / 100;

      totalAmount += orderItem.subtotal;
      order.items.push(orderItem);
    }

    order.totalAmount = Math.round(totalAmount * 100) / 100;

    const savedOrder = await this.orderRepository.save(order);

    this.logger.log({
      message: 'Order created successfully',
      orderId: savedOrder.id,
      userId: savedOrder.userId,
      totalAmount: savedOrder.totalAmount,
      itemsCount: savedOrder.items.length,
    });

    const orderEventData = this.createOrderEventData(savedOrder);
    const orderDocument = this.createOrderDocument(savedOrder);

    const asyncOperations = await Promise.allSettled([
      this.kafkaService.publish({
        topic: KafkaService.TOPICS.ORDER_CREATED,
        message: orderEventData
      }),
      this.elasticsearchService.indexDocument({
        index: ELASTICSEARCH_INDEXES.ORDERS,
        id: savedOrder.id,
        document: orderDocument
      }),
    ]);

    asyncOperations.forEach((result, index) => {
      if (result.status === 'rejected') {
        const operation = index === 0 ? 'Kafka publish' : 'Elasticsearch index';
        this.logger.error({
          message: `Failed to ${operation} order`,
          orderId: savedOrder.id,
          userId: savedOrder.userId,
          error: result.reason?.message || 'Unknown error',
          stack: result.reason?.stack,
        });
      }
    });
    return;
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

  private createOrderDocument(order: OrderEntity) {
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
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

export namespace CreateOrderService {
  export type Request = {
    userId: string;
    items: {
      productId: string;
      quantity: number;
    }[];
  };

  export type Response = void
}
