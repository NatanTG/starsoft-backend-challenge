import { MetricsService } from '@/shared/services/metrics/metrics.service';

export class MockMetricsService extends MetricsService {
  private getMetricsSpy = jest.fn();
  private incrementHttpRequestsSpy = jest.fn();
  private observeHttpDurationSpy = jest.fn();
  private setActiveConnectionsSpy = jest.fn();

  async getMetrics(): Promise<string> {
    this.getMetricsSpy();
    return 'mock-prometheus-metrics';
  }

  incrementHttpRequests(method: string, route: string, statusCode: number): void {
    this.incrementHttpRequestsSpy(method, route, statusCode);
  }

  observeHttpDuration(method: string, route: string, duration: number): void {
    this.observeHttpDurationSpy(method, route, duration);
  }

  setActiveConnections(count: number): void {
    this.setActiveConnectionsSpy(count);
  }

  getGetMetricsSpy() {
    return this.getMetricsSpy;
  }

  getIncrementHttpRequestsSpy() {
    return this.incrementHttpRequestsSpy;
  }

  getObserveHttpDurationSpy() {
    return this.observeHttpDurationSpy;
  }

  getSetActiveConnectionsSpy() {
    return this.setActiveConnectionsSpy;
  }

  resetSpies() {
    this.getMetricsSpy.mockReset();
    this.incrementHttpRequestsSpy.mockReset();
    this.observeHttpDurationSpy.mockReset();
    this.setActiveConnectionsSpy.mockReset();
  }
}