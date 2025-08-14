import { BadRequestException } from '@nestjs/common';
import { SessionService } from './session.service';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { JwtService } from '@/shared/services/jwt/jwt.service';
import { CryptService } from '@/shared/services/crypt/crypt.service';

class MockUserRepository implements UserRepository {
  findByEmailReturn: UserEntity | null = null;

  async findByEmail(): Promise<UserEntity | null> {
    return this.findByEmailReturn;
  }

  async findById(): Promise<UserEntity | null> { return null; }
  async save(): Promise<void> {}
  async updatePassword(): Promise<void> {}
}

class MockCryptService implements CryptService {
  compareReturn: boolean = false;

  async compare(): Promise<boolean> {
    return this.compareReturn;
  }

  async hash(): Promise<string> { return 'hashed'; }
}

class MockJwtService implements JwtService {
  signReturn: string = 'mock-token';

  sign(): string {
    return this.signReturn;
  }

  verify(): any { return null; }
  refresh(): string { return 'refreshed-token'; }
}

describe('SessionService', () => {
  let service: SessionService;
  let mockUserRepository: MockUserRepository;
  let mockCryptService: MockCryptService;
  let mockJwtService: MockJwtService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockCryptService = new MockCryptService();
    mockJwtService = new MockJwtService();

    service = new SessionService(
      mockUserRepository,
      mockCryptService,
      mockJwtService,
    );
  });

  it('should return access token for valid credentials', async () => {
    const user = new UserEntity();
    user.id = '1';
    user.email = 'test@example.com';
    user.password = 'hashedPassword';

    mockUserRepository.findByEmailReturn = user;
    mockCryptService.compareReturn = true;
    mockJwtService.signReturn = 'valid-jwt-token';

    const request = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await service.execute(request);

    expect(result).toEqual({
      accessToken: 'valid-jwt-token',
    });
  });

  it('should throw BadRequestException when user not found', async () => {
    mockUserRepository.findByEmailReturn = null;

    const request = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    await expect(service.execute(request)).rejects.toThrow(
      new BadRequestException('Invalid credentials.'),
    );
  });

  it('should throw BadRequestException when password is invalid', async () => {
    const user = new UserEntity();
    user.id = '1';
    user.email = 'test@example.com';
    user.password = 'hashedPassword';

    mockUserRepository.findByEmailReturn = user;
    mockCryptService.compareReturn = false;

    const request = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };

    await expect(service.execute(request)).rejects.toThrow(
      new BadRequestException('Invalid credentials.'),
    );
  });
});
