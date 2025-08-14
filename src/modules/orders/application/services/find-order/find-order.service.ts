import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';

@Injectable()
export class FindOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    payload: FindOrderService.Request,
  ): Promise<FindOrderService.Response> {
    const order = await this.orderRepository.findById(payload.id);

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

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
}

export namespace FindOrderService {
  export type Request = {
    id: string;
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
