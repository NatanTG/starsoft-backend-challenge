import { Test, TestingModule } from '@nestjs/testing';
import { KafkaJSService } from './kafkajs.service';
import { MockKafkaService } from '../../../../../test/mocks/mock-kafka-service';

describe('KafkaJSService', () => {
  let service: KafkaJSService;
  let mockKafkaService: MockKafkaService;

  beforeEach(async () => {
    mockKafkaService = new MockKafkaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KafkaJSService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    service = module.get<KafkaJSService>(KafkaJSService);
  });

  afterEach(() => {
    mockKafkaService.resetSpies();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect successfully', async () => {
    await service.connect();
    
    expect(mockKafkaService.getConnectSpy()).toHaveBeenCalled();
  });

  it('should disconnect successfully', async () => {
    await service.disconnect();
    
    expect(mockKafkaService.getDisconnectSpy()).toHaveBeenCalled();
  });

  it('should publish message successfully', async () => {
    const mockRequest = {
      topic: 'order.created',
      message: {
        id: 'order-123',
        userId: 'user-456',
        status: 'PENDING',
        items: [
          { productName: 'iPhone 15', quantity: 1, price: 1200.00 }
        ],
        totalAmount: 1200.00,
        timestamp: new Date().toISOString()
      }
    };

    await service.publish(mockRequest);

    expect(mockKafkaService.getPublishSpy()).toHaveBeenCalledWith(mockRequest);
    expect(mockKafkaService.publishCalled).toBe(true);
    expect(mockKafkaService.publishArgs).toEqual(mockRequest);
  });

  it('should subscribe to topic successfully', async () => {
    const mockCallback = jest.fn();
    const mockRequest = {
      topic: 'user.created',
      callback: mockCallback
    };

    await service.subscribe(mockRequest);

    expect(mockKafkaService.getSubscribeSpy()).toHaveBeenCalledWith(mockRequest);
  });

  it('should handle multiple message types', async () => {
    const orderCreatedMessage = {
      topic: 'order.created',
      message: { orderId: '123', status: 'PENDING' }
    };

    const orderUpdatedMessage = {
      topic: 'order.updated',
      message: { orderId: '123', status: 'SHIPPED' }
    };

    await service.publish(orderCreatedMessage);
    await service.publish(orderUpdatedMessage);

    expect(mockKafkaService.getPublishSpy()).toHaveBeenCalledTimes(2);
    expect(mockKafkaService.getPublishSpy()).toHaveBeenNthCalledWith(1, orderCreatedMessage);
    expect(mockKafkaService.getPublishSpy()).toHaveBeenNthCalledWith(2, orderUpdatedMessage);
  });
});