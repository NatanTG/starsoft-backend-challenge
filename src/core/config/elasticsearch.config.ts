import { Client } from '@elastic/elasticsearch';
import { env } from '../env';

export const createElasticsearchClient = () => {
  return new Client({
    node: env.ELASTICSEARCH_NODE,
    requestTimeout: 30000,
    pingTimeout: 3000,
    maxRetries: 3
  });
};

export const ELASTICSEARCH_INDEXES = {
  ORDERS: 'orders',
} as const;
