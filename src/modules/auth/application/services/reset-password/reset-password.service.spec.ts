import { UnauthorizedException } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { CryptService } from '@/shared/services/crypt/crypt.service';
import { JwtService } from '@/shared/services/jwt/jwt.service';

class MockUserRepository implements UserRepository {
  findByEmailReturn: UserEntity | null = null;
  updatePasswordCalled: boolean = false;
  lastUpdatedPassword: { id: string; password: string } | null = null;

  async findByEmail(): Promise<UserEntity | null> {
    return this.findByEmailReturn;
  }

  async updatePassword(id: string, password: string): Promise<void> {
    this.updatePasswordCalled = true;
    this.lastUpdatedPassword = { id, password };
  }

  async findById(): Promise<UserEntity | null> { return null; }
  async save(): Promise<void> {}
}

class MockCryptService implements CryptService {
  hashReturn: string = 'hashed-password';

  async hash(): Promise<string> {
    return this.hashReturn;
  }

  async compare(): Promise<boolean> { return true; }
}

class MockJwtService implements JwtService {
  verifyReturn: any = null;

  verify(): any {
    return this.verifyReturn;
  }

  sign(): string { return 'token'; }
  refresh(): string { return 'refreshed-token'; }
}

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;
  let mockUserRepository: MockUserRepository;
  let mockCryptService: MockCryptService;
  let mockJwtService: MockJwtService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockCryptService = new MockCryptService();
    mockJwtService = new MockJwtService();

    service = new ResetPasswordService(
      mockUserRepository,
      mockCryptService,
      mockJwtService,
    );
  });

  describe('execute', () => {
    const validRequest = {
      token: 'valid-token',
      email: 'test@example.com',
      newPassword: 'newPassword123',
    };

    it('should reset password successfully when all conditions are met', async () => {
      const user = new UserEntity();
      user.id = 'user-123';
      user.email = 'test@example.com';
      user.password = 'oldHashedPassword';

      mockUserRepository.findByEmailReturn = user;
      mockJwtService.verifyReturn = { email: 'test@example.com' };
      mockCryptService.hashReturn = 'newHashedPassword';

      await service.execute(validRequest);

      expect(mockUserRepository.updatePasswordCalled).toBe(true);
      expect(mockUserRepository.lastUpdatedPassword).toEqual({
        id: 'user-123',
        password: 'newHashedPassword',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserRepository.findByEmailReturn = null;

      await expect(service.execute(validRequest)).rejects.toThrow(
        new UnauthorizedException('Manager not found'),
      );

      expect(mockUserRepository.updatePasswordCalled).toBe(false);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const user = new UserEntity();
      user.id = 'user-123';
      user.email = 'test@example.com';
      user.password = 'oldHashedPassword';

      mockUserRepository.findByEmailReturn = user;
      mockJwtService.verifyReturn = null;

      await expect(service.execute(validRequest)).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );

      expect(mockUserRepository.updatePasswordCalled).toBe(false);
    });

    it('should verify token with correct secret', async () => {
      const user = new UserEntity();
      user.id = 'user-123';
      user.email = 'test@example.com';
      user.password = 'oldHashedPassword';

      mockUserRepository.findByEmailReturn = user;
      mockJwtService.verifyReturn = { email: 'test@example.com' };
      const verifySpy = jest.spyOn(mockJwtService, 'verify');

      await service.execute(validRequest);

      expect(verifySpy).toHaveBeenCalledWith(
        'valid-token',
        expect.stringContaining('oldHashedPassword'),
      );
    });

    it('should hash new password with salt 10', async () => {
      const user = new UserEntity();
      user.id = 'user-123';
      user.email = 'test@example.com';
      user.password = 'oldHashedPassword';

      mockUserRepository.findByEmailReturn = user;
      mockJwtService.verifyReturn = { email: 'test@example.com' };
      const hashSpy = jest.spyOn(mockCryptService, 'hash');

      await service.execute(validRequest);

      expect(hashSpy).toHaveBeenCalledWith('newPassword123', 10);
    });
  });
});