import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';

export class MockUserRepository implements UserRepository {
  findByEmailReturn: UserEntity | null = null;
  findByIdReturn: UserEntity | null = null;
  updatePasswordCalled: boolean = false;
  lastUpdatedPassword: { id: string; password: string } | null = null;

  async save(user: UserEntity): Promise<void> {
    if (user.email === 'duplicate@test.com') {
      throw new Error('User already exists');
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    if (this.findByEmailReturn !== null) {
      return this.findByEmailReturn;
    }

    if (email === 'notfound@test.com' || email === 'not-found-user') return null;
    
    return {
      id: 'user-123',
      name: 'Test User',
      email,
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;
  }

  async findById(id: string): Promise<UserEntity | null> {
    if (this.findByIdReturn !== null) {
      return this.findByIdReturn;
    }

    if (id === 'not-found-id' || id === 'not-found-user') return null;
    
    return {
      id,
      name: 'Test User',
      email: 'user@test.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    this.updatePasswordCalled = true;
    this.lastUpdatedPassword = { id, password: hashedPassword };
    
    if (id === 'invalid-user-id') {
      throw new Error('User not found');
    }
  }

  reset() {
    this.findByEmailReturn = null;
    this.findByIdReturn = null;
    this.updatePasswordCalled = false;
    this.lastUpdatedPassword = null;
  }
}