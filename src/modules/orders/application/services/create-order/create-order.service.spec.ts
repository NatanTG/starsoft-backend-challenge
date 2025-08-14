import { NotFoundException } from '@nestjs/common';
import { CreateOrderService } from './create-order.service';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';
import { MockFactory } from '../../../../../../test/mocks/mock-factory';
import { MockOrderRepository } from '../../../../../../test/mocks/mock-order-repository';
import { MockUserRepository } from '../../../../../../test/mocks/mock-user-repository';
import { MockKafkaService } from '../../../../../../test/mocks/mock-kafka-service';
import { MockElasticsearchService } from '../../../../../../test/mocks/mock-elasticsearch.service';
import { MockLogger } from '../../../../../../test/mocks/mock-logger';

describe('CreateOrderService', () => {
  let service: CreateOrderService;
  let mockOrderRepository: MockOrderRepository;
  let mockUserRepository: MockUserRepository;
  let mockKafkaService: MockKafkaService;
  let mockElasticsearchService: MockElasticsearchService;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockOrderRepository = new MockOrderRepository();
    mockUserRepository = new MockUserRepository();
    mockKafkaService = new MockKafkaService();
    mockElasticsearchService = new MockElasticsearchService();
    mockLogger = new MockLogger();

    service = new CreateOrderService(
      mockOrderRepository,
      mockUserRepository,
      mockKafkaService,
      mockElasticsearchService,
      mockLogger as any,
    );
  });

  afterEach(async () => {
    await MockFactory.cleanup();
  });

  it('should create order successfully', async () => {
    const user = new UserEntity();
    user.id = 'user-123';
    mockUserRepository.findByIdReturn = user;

    const request: CreateOrderService.Request = {
      userId: 'user-123',
      items: [{ productId: 'product-1', quantity: 2 }],
    };

    await service.execute(request);

    expect(mockOrderRepository.saveCalled).toBe(true);
    expect(mockOrderRepository.saveReturn).toEqual(
      expect.objectContaining({
        userId: 'user-123',
        status: OrderStatus.PENDING,
        totalAmount: 199.98,
      }),
    );
    expect(mockKafkaService.publishCalled).toBe(true);
    expect(mockElasticsearchService.indexDocumentCalled).toBe(true);
  });

  it('should throw NotFoundException when user not found', async () => {
    mockUserRepository.findByIdReturn = null;

    const request: CreateOrderService.Request = {
      userId: 'not-found-user',
      items: [{ productId: 'product-1', quantity: 1 }],
    };

    await expect(service.execute(request)).rejects.toThrow(
      new NotFoundException('User not found.'),
    );
    expect(mockOrderRepository.saveCalled).toBe(false);
  });

  it('should calculate total amount correctly', async () => {
    const user = new UserEntity();
    user.id = 'user-123';
    mockUserRepository.findByIdReturn = user;

    const request: CreateOrderService.Request = {
      userId: 'user-123',
      items: [
        { productId: 'product-1', quantity: 2 },
        { productId: 'product-2', quantity: 1 },
      ],
    };

    await service.execute(request);

    expect(mockOrderRepository.saveReturn.totalAmount).toBe(299.97);
    expect(mockOrderRepository.saveReturn.items).toHaveLength(2);
    expect(mockOrderRepository.saveReturn.items[0].quantity).toBe(2);
    expect(mockOrderRepository.saveReturn.items[0].subtotal).toBe(199.98);
  });
});
