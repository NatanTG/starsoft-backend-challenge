import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from '@/modules/auth/application/services/refresh-token/refresh-token.service';
import { RefreshTokenServiceSpy } from 'test/mocks/mock-auth-services';

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;
  let refreshTokenServiceSpy: RefreshTokenServiceSpy;

  beforeEach(async () => {
    refreshTokenServiceSpy = new RefreshTokenServiceSpy();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [
        {
          provide: RefreshTokenService,
          useValue: refreshTokenServiceSpy,
        },
      ],
    }).compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
  });

  afterEach(() => {
    refreshTokenServiceSpy.reset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should refresh token successfully', async () => {
    const payload = {
      acessToken: 'valid_jwt_token_example_12345',
    };

    const result = await controller.refreshToken(payload);

    expect(result).toEqual({
      acessToken: 'new_jwt_token_example_12345',
    });
    expect(refreshTokenServiceSpy.executeCalled).toBe(true);
    expect(refreshTokenServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const error = new UnauthorizedException('Invalid or expired token');
    refreshTokenServiceSpy.executeError = error;

    const payload = {
      acessToken: 'invalid_token',
    };

    await expect(controller.refreshToken(payload)).rejects.toThrow(error);
    expect(refreshTokenServiceSpy.executeCalled).toBe(true);
    expect(refreshTokenServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw BadRequestException for short token', async () => {
    const error = new BadRequestException(
      'Access token must be at least 10 characters long',
    );
    refreshTokenServiceSpy.executeError = error;

    const payload = {
      acessToken: 'short',
    };

    await expect(controller.refreshToken(payload)).rejects.toThrow(error);
    expect(refreshTokenServiceSpy.executeCalled).toBe(true);
    expect(refreshTokenServiceSpy.executeArgs).toEqual(payload);
  });
});
