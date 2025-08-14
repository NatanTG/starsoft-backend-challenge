import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { KafkaService } from '../kafka.service';
import {
  kafkaConfig,
  kafkaConsumerConfig,
  kafkaProducerConfig,
} from '@/core/config/kafka.config';
import { env } from '@/core/env';

@Injectable()
export class KafkaJSService
  extends KafkaService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(KafkaJSService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected = false;

  constructor() {
    super();
    this.logger.log(`🔧 Kafka Mock Mode: ${env.KAFKA_MOCK_MODE}`);
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer(kafkaProducerConfig);
    this.consumer = this.kafka.consumer(kafkaConsumerConfig);
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<KafkaService.ConnectResponse> {
    if (env.KAFKA_MOCK_MODE) {
      this.isConnected = true;
      this.logger.log('Kafka connection established (MOCK MODE)');
      return;
    }

    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Kafka connection established');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka', error);
      throw error;
    }
  }

  async disconnect(): Promise<KafkaService.DisconnectResponse> {
    try {
      if (this.isConnected) {
        if (env.KAFKA_MOCK_MODE) {
          this.isConnected = false;
          this.logger.log('Kafka connection closed (MOCK MODE)');
          return;
        }

        await this.producer.disconnect();
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Kafka connection closed');
      }
    } catch (error) {
      this.logger.error('Error disconnecting from Kafka', error);
    }
  }

  async publish(request: KafkaService.PublishRequest): Promise<KafkaService.PublishResponse> {
    try {
      if (!this.isConnected) {
        throw new Error('Kafka is not connected');
      }

      if (env.KAFKA_MOCK_MODE) {
        this.logger.log(`[MOCK] Message would be published to topic: ${request.topic}`, {
          messageId: request.message.id,
          messageType: request.topic,
          timestamp: new Date().toISOString(),
          payload: JSON.stringify(request.message, null, 2)
        });
        return;
      }

      await this.producer.send({
        topic: request.topic,
        messages: [
          {
            key: request.message.id || Date.now().toString(),
            value: JSON.stringify(request.message),
            timestamp: Date.now().toString(),
          },
        ],
      });

      this.logger.debug(`Message published to topic: ${request.topic}`);
    } catch (error) {
      this.logger.error(`Failed to publish message to topic ${request.topic}`, error);
      throw error;
    }
  }

  async subscribe(request: KafkaService.SubscribeRequest): Promise<KafkaService.SubscribeResponse> {
    try {
      if (!this.isConnected) {
        throw new Error('Kafka is not connected');
      }

      if (env.KAFKA_MOCK_MODE) {
        this.logger.log(`[MOCK] Would subscribe to topic: ${request.topic}`);
        return;
      }

      await this.consumer.subscribe({ topic: request.topic, fromBeginning: false });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const parsedMessage = JSON.parse(message.value?.toString() || '{}');
            this.logger.debug(`Message received from topic: ${topic}`);
            await request.callback(parsedMessage);
          } catch (error) {
            this.logger.error(
              `Error processing message from topic ${topic}`,
              error,
            );
          }
        },
      });

      this.logger.log(`Subscribed to topic: ${request.topic}`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${request.topic}`, error);
      throw error;
    }
  }
}
