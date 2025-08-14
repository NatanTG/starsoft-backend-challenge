import 'reflect-metadata';

process.env.NODE_ENV = 'test';
process.env.KAFKA_MOCK_MODE = 'true';

global.beforeEach(() => {
  if (global.gc) {
    global.gc();
  }
});

global.afterEach(async () => {
  jest.clearAllTimers();
  
  if (global.gc) {
    global.gc();
  }
  
  await new Promise(resolve => setImmediate(resolve));
});

jest.setTimeout(30000);
