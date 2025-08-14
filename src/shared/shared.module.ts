import { Module, Global } from '@nestjs/common';
import { CryptModule } from './services/crypt/crypt.module';
import { JwtModule } from './services/jwt/jwt.module';
import { MailModule } from './services/mail/mail.module';
import { MetricsModule } from './services/metrics/metrics.module';
import { MetricsController } from './controllers/metrics.controller';
import { MyLogger } from './services/logger/structured-logger.service';

@Global()
@Module({
  imports: [CryptModule, JwtModule, MailModule, MetricsModule],
  controllers: [MetricsController],
  providers: [MyLogger],
  exports: [CryptModule, JwtModule, MailModule, MetricsModule, MyLogger],
})
export class SharedModule {}
