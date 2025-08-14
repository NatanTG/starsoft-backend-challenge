import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { CryptService } from '@/shared/services/crypt/crypt.service';
import { env } from '@/core/env';
import { MailMessageService } from '@/shared/services/mail/mail.service';
import { preRegisterTemplate } from '@/shared/services/mail/templates/pre-register';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('MailMessageService')
    private readonly mailMessageService: MailMessageService,

    @Inject('CryptService')
    private readonly cryptService: CryptService,
  ) {}

  async execute(
    payload: CreateUserService.Request,
  ): Promise<CreateUserService.Response> {
    const existingByEmail = await this.userRepository.findByEmail(
      payload.email,
    );

    if (existingByEmail) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await this.cryptService.hash(payload.password, 10);

    const user = new UserEntity();
    user.name = payload.name;
    user.email = payload.email;
    user.password = hashedPassword;

    await this.userRepository.save(user);

    await this.mailMessageService.send({
      from: 'suporte@nexorum.shop',
      to: [user.email],
      subject: 'Cadastro!',
      body: preRegisterTemplate(env.DASHBOARD_URL, user.name),
    });

    return;
  }
}

export namespace CreateUserService {
  export type Request = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = void;
}
