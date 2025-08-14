import { BadRequestException } from '@nestjs/common';
import {
  MailMessageService,
  MessageMail,
  MessageMailResponse,
} from 'src/shared/services/mail/mail.service';

export class ResendServiceSpy implements MailMessageService {
  sendCalled = false;
  sendArgs: MessageMail | null = null;
  sendReturn: MessageMailResponse | void = { id: 'spy-id' };

  async send(message: MessageMail): Promise<MessageMailResponse | void> {
    this.sendCalled = true;
    this.sendArgs = message;

    if (!this.sendReturn) {
      throw new BadRequestException('Send failed');
    }

    return this.sendReturn;
  }
}
