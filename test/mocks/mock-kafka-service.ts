import { KafkaService } from '@/shared/services/kafka/kafka.service';

export class MockKafkaService extends KafkaService {
  publishCalled: boolean = false;
  publishArgs: any = null;
  private publishSpy = jest.fn();
  private subscribeSpy = jest.fn();
  private connectSpy = jest.fn();
  private disconnectSpy = jest.fn();

  async publish(request: KafkaService.PublishRequest): Promise<void> {
    this.publishCalled = true;
    this.publishArgs = request;
    this.publishSpy(request);
  }

  async subscribe(request: KafkaService.SubscribeRequest): Promise<void> {
    this.subscribeSpy(request);
  }

  async connect(): Promise<void> {
    this.connectSpy();
  }

  async disconnect(): Promise<void> {
    this.disconnectSpy();
  }

  getPublishSpy() {
    return this.publishSpy;
  }

  getSubscribeSpy() {
    return this.subscribeSpy;
  }

  getConnectSpy() {
    return this.connectSpy;
  }

  getDisconnectSpy() {
    return this.disconnectSpy;
  }

  resetSpies() {
    this.publishCalled = false;
    this.publishArgs = null;
    this.publishSpy.mockReset();
    this.subscribeSpy.mockReset();
    this.connectSpy.mockReset();
    this.disconnectSpy.mockReset();
  }
}
