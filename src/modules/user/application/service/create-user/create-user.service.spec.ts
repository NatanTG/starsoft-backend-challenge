import { ConflictException } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { CryptService } from '@/shared/services/crypt/crypt.service';
import {
  MailMessageService,
  MessageMail,
} from '@/shared/services/mail/mail.service';

class MockUserRepository implements UserRepository {
  findByEmailReturn: UserEntity | null = null;
  saveReturn: UserEntity = new UserEntity();

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findByEmailReturn;
  }

  async save(user: UserEntity): Promise<void> {
    this.saveReturn = user;
    return;
  }

  async updatePassword(id: string, password: string): Promise<void> {
    return;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return null;
  }
}

class MockCryptService implements CryptService {
  hashReturn: string = 'hashedPassword';

  async compare(value: string, hash: string): Promise<boolean> {
    return true;
  }

  async hash(value: string, salt: number): Promise<string> {
    return this.hashReturn;
  }
}

class MockMailService implements MailMessageService {
  sendCalled: boolean = false;
  sendArgs: MessageMail | null = null;

  async send(message: MessageMail): Promise<void> {
    this.sendCalled = true;
    this.sendArgs = message;
  }
}

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let mockUserRepository: MockUserRepository;
  let mockCryptService: MockCryptService;
  let mockMailService: MockMailService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockCryptService = new MockCryptService();
    mockMailService = new MockMailService();

    createUserService = new CreateUserService(
      mockUserRepository,
      mockMailService,
      mockCryptService,
    );
  });

  it('should create user successfully', async () => {
    mockUserRepository.findByEmailReturn = null;
    mockCryptService.hashReturn = 'hashedPassword123';

    const request = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await createUserService.execute(request);

    expect(mockMailService.sendCalled).toBe(true);
    expect(mockMailService.sendArgs?.to).toEqual(['john@example.com']);
    expect(mockMailService.sendArgs?.subject).toBe('Cadastro!');
  });

  it('should throw ConflictException when user already exists', async () => {
    const existingUser = new UserEntity();
    existingUser.email = 'john@example.com';
    mockUserRepository.findByEmailReturn = existingUser;

    const request = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await expect(createUserService.execute(request)).rejects.toThrow(
      new ConflictException('User with this email already exists.'),
    );
  });

  it('should hash password before saving', async () => {
    mockUserRepository.findByEmailReturn = null;
    mockCryptService.hashReturn = 'hashedPassword123';

    const request = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await createUserService.execute(request);

    expect(mockUserRepository.saveReturn.password).toBe('hashedPassword123');
    expect(mockUserRepository.saveReturn.name).toBe('John Doe');
    expect(mockUserRepository.saveReturn.email).toBe('john@example.com');
  });
});
