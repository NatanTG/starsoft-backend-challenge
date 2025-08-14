import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';
import { MockKafkaService } from '../../../../test/mocks/mock-kafka-service';

describe('KafkaService', () => {
  let service: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: KafkaService, useClass: MockKafkaService },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should publish message successfully', async () => {
    const request = { topic: 'test-topic', message: { data: 'test' } };

    await expect(service.publish(request)).resolves.not.toThrow();
  });

  it('should subscribe to topic successfully', async () => {
    const request = { topic: 'test-topic', callback: jest.fn() };

    await expect(service.subscribe(request)).resolves.not.toThrow();
  });

  it('should connect successfully', async () => {
    await expect(service.connect()).resolves.not.toThrow();
  });
});