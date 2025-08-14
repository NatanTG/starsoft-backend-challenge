import { NotFoundException } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { JwtService } from '@/shared/services/jwt/jwt.service';
import { MailMessageService, MessageMail } from '@/shared/services/mail/mail.service';

class MockUserRepository implements UserRepository {
  findByEmailReturn: UserEntity | null = null;

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findByEmailReturn;
  }

  async findById(id: string): Promise<UserEntity | null> { return null; }
  async save(user: UserEntity): Promise<void> {}
  async updatePassword(id: string, password: string): Promise<void> {}
}

class MockJwtService implements JwtService {
  signReturn: string = 'mock-token';

  sign(): string {
    return this.signReturn;
  }

  verify(): any { return null; }
  refresh(): string { return 'refreshed-token'; }
}

class MockMailMessageService implements MailMessageService {
  sendCalled: boolean = false;
  lastSentMessage: MessageMail | null = null;

  async send(message: MessageMail): Promise<void> {
    this.sendCalled = true;
    this.lastSentMessage = message;
  }
}

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let mockUserRepository: MockUserRepository;
  let mockMailMessageService: MockMailMessageService;
  let mockJwtService: MockJwtService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockMailMessageService = new MockMailMessageService();
    mockJwtService = new MockJwtService();

    service = new ForgotPasswordService(
      mockUserRepository,
      mockMailMessageService,
      mockJwtService,
    );
  });

  describe('execute', () => {
    it('should send password reset email when user exists', async () => {
      const user = new UserEntity();
      user.id = '1';
      user.email = 'test@example.com';
      user.password = 'hashedPassword';

      mockUserRepository.findByEmailReturn = user;
      mockJwtService.signReturn = 'reset-token';

      const request = {
        email: 'test@example.com',
      };

      await service.execute(request);

      expect(mockMailMessageService.sendCalled).toBe(true);
      expect(mockMailMessageService.lastSentMessage).toEqual({
        from: 'ecommerce@nexorum.shop',
        to: ['test@example.com'],
        subject: 'Redefinição de senha',
        body: expect.any(String),
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findByEmailReturn = null;

      const request = {
        email: 'nonexistent@example.com',
      };

      await expect(service.execute(request)).rejects.toThrow(
        new NotFoundException('user not found'),
      );

      expect(mockMailMessageService.sendCalled).toBe(false);
    });

    it('should generate JWT token with user email and password', async () => {
      const user = new UserEntity();
      user.id = '1';
      user.email = 'test@example.com';
      user.password = 'hashedPassword';

      mockUserRepository.findByEmailReturn = user;
      const signSpy = jest.spyOn(mockJwtService, 'sign');

      const request = {
        email: 'test@example.com',
      };

      await service.execute(request);

      expect(signSpy).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.stringContaining('hashedPassword'),
      );
    });
  });
});