import { Test, TestingModule } from '@nestjs/testing';
import { MockOrderRepository } from './mock-order-repository';
import { MockUserRepository } from './mock-user-repository';
import { MockKafkaService } from './mock-kafka-service';
import { MockElasticsearchService } from './mock-elasticsearch.service';
import { MockLogger } from './mock-logger';
import { MockJwtService } from './mock-jwt.service';
import { MockCryptService } from './mock-crypt.service';
import { MockMetricsService } from './mock-metrics.service';

export class MockFactory {

  static async createBasicTestModule(providers: any[] = []): Promise<TestingModule> {
    const baseProviders = [
      { provide: 'OrderRepository', useClass: MockOrderRepository },
      { provide: 'UserRepository', useClass: MockUserRepository },
      { provide: 'KafkaService', useClass: MockKafkaService },
      { provide: 'ElasticsearchService', useClass: MockElasticsearchService },
      { provide: 'Logger', useClass: MockLogger },
      { provide: 'JwtService', useClass: MockJwtService },
      { provide: 'CryptService', useClass: MockCryptService },
      { provide: 'MetricsService', useClass: MockMetricsService },
    ];

    return Test.createTestingModule({
      providers: [...baseProviders, ...providers],
    }).compile();
  }

  static async createLightweightTestModule(providers: any[] = []): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: providers,
    }).compile();
  }


  static async createOrderTestModule(providers: any[] = []): Promise<TestingModule> {
    const orderProviders = [
      { provide: 'OrderRepository', useClass: MockOrderRepository },
      { provide: 'UserRepository', useClass: MockUserRepository },
      { provide: 'KafkaService', useClass: MockKafkaService },
      { provide: 'ElasticsearchService', useClass: MockElasticsearchService },
      { provide: 'Logger', useClass: MockLogger },
    ];

    return Test.createTestingModule({
      providers: [...orderProviders, ...providers],
    }).compile();
  }

  static async createAuthTestModule(providers: any[] = []): Promise<TestingModule> {
    const authProviders = [
      { provide: 'UserRepository', useClass: MockUserRepository },
      { provide: 'JwtService', useClass: MockJwtService },
      { provide: 'CryptService', useClass: MockCryptService },
      { provide: 'Logger', useClass: MockLogger },
    ];

    return Test.createTestingModule({
      providers: [...authProviders, ...providers],
    }).compile();
  }

  static async cleanup(module?: TestingModule): Promise<void> {
    if (module) {
      await module.close();
    }
    
    if (global.gc) {
      global.gc();
    }
  }
}