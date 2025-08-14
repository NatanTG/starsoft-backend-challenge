import { KafkaConfig, Partitioners } from 'kafkajs';
import { env } from '../env';

export const kafkaConfig: KafkaConfig = {
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(',').map(broker => broker.trim()),
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

export const kafkaConsumerConfig = {
  groupId: `${env.KAFKA_CLIENT_ID}-consumer`,
  sessionTimeout: 30000,
  rebalanceTimeout: 60000,
  heartbeatInterval: 3000,
};

export const kafkaProducerConfig = {
  maxInFlightRequests: 1,
  idempotent: false,
  transactionTimeout: 30000,
  createPartitioner: Partitioners.LegacyPartitioner,
  requestTimeout: 30000,
  acks: 1,
  compression: 'gzip',
  batchSize: 16384,
  maxRequestSize: 1048576,
};
