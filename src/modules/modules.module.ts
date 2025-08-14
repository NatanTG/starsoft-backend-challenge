import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [UserModule, AuthModule, OrderModule],
  exports: [UserModule, AuthModule, OrderModule],
})
export class ModulesModule {}
