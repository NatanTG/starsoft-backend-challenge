import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from '@/modules/auth/application/services/reset-password/reset-password.service';
import { ResetPasswordServiceSpy } from 'test/mocks/mock-auth-services';

describe('ResetPasswordController', () => {
  let controller: ResetPasswordController;
  let resetPasswordServiceSpy: ResetPasswordServiceSpy;

  beforeEach(async () => {
    resetPasswordServiceSpy = new ResetPasswordServiceSpy();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [
        {
          provide: ResetPasswordService,
          useValue: resetPasswordServiceSpy,
        },
      ],
    }).compile();

    controller = module.get<ResetPasswordController>(ResetPasswordController);
  });

  afterEach(() => {
    resetPasswordServiceSpy.reset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should reset password successfully', async () => {
    const payload = {
      token: 'valid_reset_token_12345',
      email: 'user@example.com',
      newPassword: 'newSecurePassword123',
    };

    await expect(controller.resetPassword(payload)).resolves.toBeUndefined();
    expect(resetPasswordServiceSpy.executeCalled).toBe(true);
    expect(resetPasswordServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw UnauthorizedException for user not found', async () => {
    const error = new UnauthorizedException('Manager not found');
    resetPasswordServiceSpy.executeError = error;

    const payload = {
      token: 'valid_reset_token_12345',
      email: 'notfound@example.com',
      newPassword: 'newSecurePassword123',
    };

    await expect(controller.resetPassword(payload)).rejects.toThrow(error);
    expect(resetPasswordServiceSpy.executeCalled).toBe(true);
    expect(resetPasswordServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const error = new UnauthorizedException('Invalid token');
    resetPasswordServiceSpy.executeError = error;

    const payload = {
      token: 'invalid_token',
      email: 'user@example.com',
      newPassword: 'newSecurePassword123',
    };

    await expect(controller.resetPassword(payload)).rejects.toThrow(error);
    expect(resetPasswordServiceSpy.executeCalled).toBe(true);
    expect(resetPasswordServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw BadRequestException for validation errors', async () => {
    const error = new BadRequestException(
      'Token must be at least 10 characters long',
    );
    resetPasswordServiceSpy.executeError = error;

    const payload = {
      token: 'short',
      email: 'user@example.com',
      newPassword: 'newSecurePassword123',
    };

    await expect(controller.resetPassword(payload)).rejects.toThrow(error);
    expect(resetPasswordServiceSpy.executeCalled).toBe(true);
    expect(resetPasswordServiceSpy.executeArgs).toEqual(payload);
  });
});
