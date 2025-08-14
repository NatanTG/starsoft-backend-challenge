import { Test, TestingModule } from '@nestjs/testing';
import { KafkaJSService } from './kafkajs.service';

const mockProducer = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  send: jest.fn().mockResolvedValue(undefined),
};

const mockConsumer = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  subscribe: jest.fn().mockResolvedValue(undefined),
  run: jest.fn().mockResolvedValue(undefined),
};

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue(mockProducer),
    consumer: jest.fn().mockReturnValue(mockConsumer),
  })),
}));

jest.mock('@/core/config/kafka.config', () => ({
  kafkaConfig: { brokers: ['localhost:9092'] },
  kafkaConsumerConfig: { groupId: 'test-group' },
  kafkaProducerConfig: { maxInFlightRequests: 1 },
}));

jest.mock('@/core/env', () => ({
  env: { KAFKA_MOCK_MODE: true },
}));

describe('KafkaJSService', () => {
  let service: KafkaJSService;

  beforeEach(() => {
    service = new KafkaJSService();
  });

  it('should connect successfully', async () => {
    await expect(service.connect()).resolves.not.toThrow();
  });

  it('should publish message successfully', async () => {
    await service.connect();
    const request = { topic: 'test-topic', message: { data: 'test' } };

    await expect(service.publish(request)).resolves.not.toThrow();
  });
});