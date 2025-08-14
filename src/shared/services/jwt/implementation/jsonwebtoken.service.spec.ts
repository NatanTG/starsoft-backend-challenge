import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenService } from './jsonwebtoken.service';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('@/core/env', () => ({
  env: { JWT_SECRET: 'test-secret-key' },
}));

import * as jwt from 'jsonwebtoken';

const mockSign = jwt.sign as jest.MockedFunction<typeof jwt.sign>;
const mockVerify = jwt.verify as jest.MockedFunction<typeof jwt.verify>;

describe('JsonWebTokenService', () => {
  let service: JsonWebTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonWebTokenService],
    }).compile();

    service = module.get<JsonWebTokenService>(JsonWebTokenService);
    jest.clearAllMocks();
  });

  it('should sign token successfully', () => {
    mockSign.mockReturnValue('signed-token' as any);
    const payload = { userId: '123', email: 'test@example.com' };

    const result = service.sign(payload);

    expect(mockSign).toHaveBeenCalledWith(payload, 'test-secret-key', { expiresIn: '1h' });
    expect(result).toBe('signed-token');
  });

  it('should verify token successfully', () => {
    const mockPayload = { userId: '123', email: 'test@example.com' };
    mockVerify.mockReturnValue(mockPayload as any);

    const result = service.verify('valid-token');

    expect(mockVerify).toHaveBeenCalledWith('valid-token', 'test-secret-key', undefined);
    expect(result).toEqual(mockPayload);
  });

  it('should throw UnauthorizedException for invalid token', () => {
    mockVerify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => service.verify('invalid-token')).toThrow(UnauthorizedException);
  });
});