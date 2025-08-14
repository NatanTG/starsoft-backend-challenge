import { UserEntity } from '@/modules/user/domain/entities/user.entity';

export interface UserRepository {
  save: (user: UserEntity) => Promise<void>;
  findByEmail: (email: string) => Promise<UserEntity | null>;
  findById: (id: string) => Promise<UserEntity | null>;
  updatePassword: (id: string, password: string) => Promise<void>;
}
