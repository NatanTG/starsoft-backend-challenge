import { Injectable, Inject } from '@nestjs/common';
import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import type { PaginatedResult } from '@/shared/types/pagination.types';

@Injectable()
export class ListOrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    payload: ListOrdersService.Request,
  ): Promise<PaginatedResult<ListOrdersService.Response>> {
    const result = await this.orderRepository.findAll(payload);

    return {
      ...result,
      data: result.data.map(order => ({
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.items.map(item => ({
          id: item.id,
          orderId: item.orderId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      }))
    };
  }
}

export namespace ListOrdersService {
  export type Request = {
    page: number;
    limit: number;
    offset: number;
  };

  export type Response = {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    items: {
      id: string;
      orderId: string;
      productName: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}
