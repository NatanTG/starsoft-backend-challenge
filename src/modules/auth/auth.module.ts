import { Module } from '@nestjs/common';
import { SessionController } from './presentation/session/session.controller';
import { RefreshTokenController } from './presentation/refresh-token/refresh-token.controller';
import { ForgotPasswordController } from './presentation/forgot-password/forgot-password.controller';
import { ResetPasswordController } from './presentation/reset-password/reset-password.controller';
import { SessionService } from './application/services/session/session.service';
import { RefreshTokenService } from './application/services/refresh-token/refresh-token.service';
import { ResetPasswordService } from './application/services/reset-password/reset-password.service';
import { ForgotPasswordService } from './application/services/forgot-password/forgot-password.service';
import { SharedModule } from '@/shared/shared.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SharedModule, UserModule],
  controllers: [
    SessionController,
    RefreshTokenController,
    ForgotPasswordController,
    ResetPasswordController,
  ],
  providers: [
    SessionService,
    RefreshTokenService,
    ResetPasswordService,
    ForgotPasswordService,
  ],
  exports: [
    SessionService,
    RefreshTokenService,
    ResetPasswordService,
    ForgotPasswordService,
  ],
})
export class AuthModule {}
