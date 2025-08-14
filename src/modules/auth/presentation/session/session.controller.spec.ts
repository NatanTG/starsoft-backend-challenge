import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SessionService } from '@/modules/auth/application/services/session/session.service';
import { SessionController } from '@/modules/auth/presentation/session/session.controller';
import { SessionServiceSpy } from 'test/mocks/mock-auth-services';

describe('SessionController', () => {
  let controller: SessionController;
  let sessionServiceSpy: SessionServiceSpy;

  beforeEach(async () => {
    sessionServiceSpy = new SessionServiceSpy();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: sessionServiceSpy,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  afterEach(() => {
    sessionServiceSpy.reset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return access token for valid credentials', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await controller.login(payload);

    expect(result).toEqual({
      acessToken: 'jwt_token_example_12345',
    });
    expect(sessionServiceSpy.executeCalled).toBe(true);
    expect(sessionServiceSpy.executeArgs).toEqual(payload);
  });

  it('should throw BadRequestException for invalid credentials', async () => {
    const payload = {
      email: 'invalid@test.com',
      password: 'wrongpassword',
    };

    await expect(controller.login(payload)).rejects.toThrow(
      new BadRequestException('Invalid credentials'),
    );
    expect(sessionServiceSpy.executeCalled).toBe(true);
    expect(sessionServiceSpy.executeArgs).toEqual(payload);
  });
});
