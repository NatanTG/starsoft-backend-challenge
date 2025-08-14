import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { UserRepositoryImpl } from './infrastructure/repositories/implementation/user.repository.impl';
import { CreateUserController } from './presentation/create-user.controller';
import { CreateUserService } from './application/service/create-user/create-user.service';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SharedModule],
  controllers: [CreateUserController],
  providers: [
    UserRepositoryImpl,
    CreateUserService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    UserRepositoryImpl,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
