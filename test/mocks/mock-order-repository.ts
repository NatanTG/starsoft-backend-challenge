import { OrderRepository } from '@/modules/orders/infrastructure/repositories/order.repository';
import { OrderEntity } from '@/modules/orders/domain/entities/order.entity';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { PaginatedResult } from '@/shared/types/pagination.types';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';

export class MockOrderRepository implements OrderRepository {
  saveCalled: boolean = false;
  saveReturn: OrderEntity = new OrderEntity();

  async save(order: OrderEntity): Promise<OrderEntity> {
    this.saveCalled = true;
    this.saveReturn = {
      id: 'order-123',
      userId: order.userId,
      user: { 
        id: order.userId, 
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: order.status || OrderStatus.PENDING,
      totalAmount: order.totalAmount || 199.99,
      items: order.items || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as OrderEntity;
    return this.saveReturn;
  }

  async findById(id: string): Promise<OrderEntity | null> {
    if (id === 'not-found-id' || id === 'not-found-user') return null;
    
    return {
      id,
      userId: 'user-123',
      user: { 
        id: 'user-123', 
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: OrderStatus.PENDING,
      totalAmount: 199.99,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as OrderEntity;
  }

  async update(id: string, updateData: Partial<OrderEntity>): Promise<void> {
    if (id === 'not-found-id') {
      throw new Error('Order not found');
    }
  }

  async delete(id: string): Promise<void> {
    if (id === 'not-found-id') {
      throw new Error('Order not found');
    }
  }

  async findByUserId(userId: string, params: OrderRepository.FindByUserIdParams): Promise<PaginatedResult<OrderEntity>> {
    if (userId === 'empty-user') {
      return { 
        data: [], 
        total: 0, 
        page: params.page, 
        limit: params.limit, 
        totalPages: 0 
      };
    }
    
    const order = {
      id: 'order-1',
      userId,
      user: { 
        id: userId, 
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: OrderStatus.PENDING,
      totalAmount: 199.99,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as OrderEntity;

    return {
      data: [order],
      total: 1,
      page: params.page,
      limit: params.limit,
      totalPages: 1,
    };
  }

  async findAll(params: OrderRepository.FindAllParams): Promise<PaginatedResult<OrderEntity>> {
    const order = {
      id: 'order-1',
      userId: 'user-123',
      user: { 
        id: 'user-123', 
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: OrderStatus.PENDING,
      totalAmount: 199.99,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as OrderEntity;

    return {
      data: [order],
      total: 1,
      page: params.page,
      limit: params.limit,
      totalPages: 1,
    };
  }

  reset() {
    this.saveCalled = false;
    this.saveReturn = new OrderEntity();
  }
}