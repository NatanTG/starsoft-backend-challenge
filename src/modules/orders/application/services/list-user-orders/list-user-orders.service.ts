import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import type { PaginatedResult } from '@/shared/types/pagination.types';
import { NotFound } from '@aws-sdk/client-s3';

@Injectable()
export class ListUserOrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    payload: ListUserOrdersService.Request,
  ): Promise<PaginatedResult<ListUserOrdersService.Response>> {
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const result = await this.orderRepository.findByUserId(
      payload.userId,
      payload,
    );

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

export namespace ListUserOrdersService {
  export type Request = {
    userId: string;
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
