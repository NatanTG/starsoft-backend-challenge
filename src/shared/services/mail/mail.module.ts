import { Module } from '@nestjs/common';
import { ResendService } from './implementation/resend.service';

@Module({
  providers: [
    {
      provide: 'MailMessageService',
      useClass: ResendService,
    },
  ],
  exports: ['MailMessageService'],
})
export class MailModule {}
