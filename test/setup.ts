import 'reflect-metadata';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.KAFKA_MOCK_MODE = 'true';

// Global test cleanup and performance optimization
global.beforeEach(() => {
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
});

global.afterEach(async () => {
  // Clear all timers
  jest.clearAllTimers();
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // Add small delay to allow cleanup
  await new Promise(resolve => setImmediate(resolve));
});

// Increase timeout for individual tests if they're taking too long
jest.setTimeout(30000);
