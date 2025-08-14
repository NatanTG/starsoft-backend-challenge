import { Test, TestingModule } from '@nestjs/testing';
import { MyLogger } from './structured-logger.service';

describe('MyLogger (StructuredLoggerService)', () => {
  let service: MyLogger;

  const mockConsole = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyLogger],
    }).compile();

    service = module.get<MyLogger>(MyLogger);

    console.log = mockConsole.log;
    console.error = mockConsole.error;
    console.warn = mockConsole.warn;
    console.debug = mockConsole.debug;

    jest.clearAllMocks();
  });

  it('should set context successfully', () => {
    expect(() => service.setContext('TestContext')).not.toThrow();
  });

  it('should log messages successfully', () => {
    service.log('Test message');

    expect(mockConsole.log).toHaveBeenCalled();
  });

  it('should log errors successfully', () => {
    service.error('Error message');

    expect(mockConsole.error).toHaveBeenCalled();
  });
});