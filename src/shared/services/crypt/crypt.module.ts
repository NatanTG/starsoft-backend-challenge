import { Module } from '@nestjs/common';
import { BcryptService } from './implementation/bcrypt.service';

@Module({
  providers: [
    {
      provide: 'CryptService',
      useClass: BcryptService,
    },
  ],
  exports: ['CryptService'],
})
export class CryptModule {}
