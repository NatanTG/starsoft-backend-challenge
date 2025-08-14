import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import type { PaginatedResult } from '@/shared/types/pagination.types';

export interface OrderRepository {
  save: (order: OrderEntity) => Promise<OrderEntity>;
  findById: (id: string) => Promise<OrderEntity | null>;
  findByUserId: (
    userId: string,
    params: OrderRepository.FindByUserIdParams,
  ) => Promise<PaginatedResult<OrderEntity>>;
  findAll: (
    params: OrderRepository.FindAllParams,
  ) => Promise<PaginatedResult<OrderEntity>>;
  update: (id: string, data: Partial<OrderEntity>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export namespace OrderRepository {
  export type FindByUserIdParams = {
    page: number;
    limit: number;
    offset: number;
  };
  export type FindAllParams = {
    page: number;
    limit: number;
    offset: number;
  };
}
