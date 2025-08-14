import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from '@/modules/user/application/service/create-user/create-user.service';

class MockCreateUserService {
  async execute(payload: any): Promise<void> {
    if (payload.email === 'existing@example.com') {
      throw new ConflictException('User with this email already exists.');
    }
    return;
  }
}

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let mockCreateUserService: MockCreateUserService;

  beforeEach(async () => {
    mockCreateUserService = new MockCreateUserService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CreateUserService,
          useValue: mockCreateUserService,
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user successfully', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await expect(controller.createUser(payload)).resolves.toBeUndefined();
  });

  it('should throw ConflictException for existing user', async () => {
    const payload = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
    };

    await expect(controller.createUser(payload)).rejects.toThrow(
      new ConflictException('User with this email already exists.'),
    );
  });
});
