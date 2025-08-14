import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });

    return userFound || null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userFound = await this.userRepository.findOne({
      where: { email },
    });

    return userFound || null;
  }

  async save(user: UserEntity): Promise<void> {
    await this.userRepository.save(user);
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.userRepository.update({ id }, { password });
  }
}
