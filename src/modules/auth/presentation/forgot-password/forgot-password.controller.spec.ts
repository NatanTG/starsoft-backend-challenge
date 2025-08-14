import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from '@/modules/auth/application/services/forgot-password/forgot-password.service';
import { ForgotPasswordServiceSpy } from 'test/mocks/mock-auth-services';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;
  let forgotPasswordServiceSpy: ForgotPasswordServiceSpy;

  beforeEach(async () => {
    forgotPasswordServiceSpy = new ForgotPasswordServiceSpy();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
      providers: [
        {
          provide: ForgotPasswordService,
          useValue: forgotPasswordServiceSpy,
        },
      ],
    }).compile();

    controller = module.get<ForgotPasswordController>(ForgotPasswordController);
  });

  afterEach(() => {
    forgotPasswordServiceSpy.reset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send password reset email successfully', async () => {
    const payload = {
      email: 'user@example.com',
    };

    await expect(controller.forgotPassword(payload)).resolves.toBeUndefined();
    expect(forgotPasswordServiceSpy.executeCalled).toBe(true);
    expect(forgotPasswordServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw NotFoundException for user not found', async () => {
    const error = new NotFoundException('user not found');
    forgotPasswordServiceSpy.executeError = error;

    const payload = {
      email: 'notfound@example.com',
    };

    await expect(controller.forgotPassword(payload)).rejects.toThrow(error);
    expect(forgotPasswordServiceSpy.executeCalled).toBe(true);
    expect(forgotPasswordServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw BadRequestException for invalid email format', async () => {
    const error = new BadRequestException('Invalid email format');
    forgotPasswordServiceSpy.executeError = error;

    const payload = {
      email: 'invalid-email',
    };

    await expect(controller.forgotPassword(payload)).rejects.toThrow(error);
    expect(forgotPasswordServiceSpy.executeCalled).toBe(true);
    expect(forgotPasswordServiceSpy.executeArgs).toEqual(payload);
  });
});
