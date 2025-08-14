import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  MailMessageService,
  MessageMail,
  MessageMailResponse,
} from '../mail.service';
import { Resend } from 'resend';
import { env } from '@/core/env';

@Injectable()
export class ResendService implements MailMessageService {
  resend: Resend;
  constructor() {
    this.resend = new Resend(env.RESEND_KEY);
  }

  async send(message: MessageMail): Promise<MessageMailResponse | void> {
    const { data, error } = await this.resend.emails.send({
      from: message.from,
      to: message.to,
      subject: message.subject,
      html: message.body,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }

    return {
      id: data?.id || '',
    };
  }
}
