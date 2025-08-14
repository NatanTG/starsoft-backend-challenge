import {
  MailMessageService,
  MessageMail,
  MessageMailResponse,
} from '@/shared/services/mail/mail.service';

export class MockMailMessageService implements MailMessageService {
  sendCalled = false;
  lastSentMessage: MessageMail | null = null;

  async send(message: MessageMail): Promise<MessageMailResponse | void> {
    this.sendCalled = true;
    this.lastSentMessage = message;
    return { id: 'mock-message-id' };
  }

  reset() {
    this.sendCalled = false;
    this.lastSentMessage = null;
  }
}