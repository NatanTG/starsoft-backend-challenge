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

    return result;
  }
}

export namespace ListOrdersService {
  export type Request = {
    page: number;
    limit: number;
    offset: number;
  };

  export type Response = OrderEntity;
}
