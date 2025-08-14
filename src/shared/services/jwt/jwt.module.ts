import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './implementation/jsonwebtoken.service';

@Module({
  providers: [
    {
      provide: 'JwtService',
      useClass: JsonWebTokenService,
    },
  ],
  exports: ['JwtService'],
})
export class JwtModule {}
