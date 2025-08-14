import { MessageMail } from '@/shared/services/mail/mail.service';
import { ResendServiceSpy } from 'test/mocks/mock-resend';

describe('ResendService', () => {
  it('should call send with correct arguments', async () => {
    const sut = new ResendServiceSpy();
    const message: MessageMail = {
      from: 'test@domain.com',
      to: ['user@domain.com'],
      subject: 'Test',
      body: '<b>Hello</b>',
    };

    const response = await sut.send(message);

    expect(sut.sendCalled).toBe(true);
    expect(sut.sendArgs).toEqual(message);
    expect(response).toBeDefined();
    expect(response?.id).toBe('spy-id');
  });

  it('should handle send failure', async () => {
    const sut = new ResendServiceSpy();
    sut.sendReturn = undefined;

    await expect(
      sut.send({
        from: 'fail@domain.com',
        to: ['fail@domain.com'],
        subject: 'Fail',
        body: 'fail',
      }),
    ).rejects.toThrow('Send failed');
  });
});
