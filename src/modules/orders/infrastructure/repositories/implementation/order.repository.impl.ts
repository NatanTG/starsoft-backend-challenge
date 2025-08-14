import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import { PaginatedResult } from '@/shared/types/pagination.types';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async save(order: OrderEntity): Promise<OrderEntity> {
    return await this.orderRepository.save(order);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const orderFound = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'user'],
    });

    return orderFound || null;
  }

  async findByUserId(
    userId: string,
    params: OrderRepository.FindByUserIdParams,
  ): Promise<PaginatedResult<OrderEntity>> {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { userId },
      relations: ['items', 'user'],
      take: params.limit,
      skip: params.offset,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / params.limit);

    return {
      data: orders,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  }

  async findAll(
    params: OrderRepository.FindAllParams,
  ): Promise<PaginatedResult<OrderEntity>> {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['items', 'user'],
      take: params.limit,
      skip: params.offset,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / params.limit);

    return {
      data: orders,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  }

  async update(id: string, data: Partial<OrderEntity>): Promise<void> {
    await this.orderRepository.update({ id }, data);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete({ id });
  }
}
