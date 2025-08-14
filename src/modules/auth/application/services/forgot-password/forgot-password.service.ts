import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { env } from '@/core/env';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { JwtService } from '@/shared/services/jwt/jwt.service';
import { MailMessageService } from '@/shared/services/mail/mail.service';
import { passwordResetTemplate } from '@/shared/services/mail/templates/password-reset';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('MailMessageService')
    private readonly mailMessageService: MailMessageService,
    @Inject('JwtService')
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: ForgotPasswordService.Request): Promise<void> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const token = this.jwtService.sign(
      { email: user.email },
      user.password + env.JWT_SECRET,
    );
    const resetLink = `${env.DASHBOARD_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    await this.mailMessageService.send({
      from: env.MAIL_FROM_ADDRESS,
      to: [payload.email],
      subject: 'Redefinição de senha',
      body: passwordResetTemplate(resetLink),
    });
  }
}

export namespace ForgotPasswordService {
  export type Request = {
    email: string;
  };
}
