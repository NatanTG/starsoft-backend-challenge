import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from '@/core/env';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { CryptService } from '@/shared/services/crypt/crypt.service';
import { JwtService } from '@/shared/services/jwt/jwt.service';

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('CryptService')
    private readonly cryptService: CryptService,
    @Inject('JwtService')
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: ResetPasswordService.Request): Promise<void> {
    const establichment = await this.userRepository.findByEmail(payload.email);
    if (!establichment) {
      throw new UnauthorizedException('Manager not found');
    }

    const decodedToken = this.jwtService.verify(
      payload.token,
      establichment.password + env.JWT_SECRET,
    );
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const hashedPassword = await this.cryptService.hash(
      payload.newPassword,
      10,
    );
    await this.userRepository.updatePassword(establichment.id, hashedPassword);

    return;
  }
}

export namespace ResetPasswordService {
  export type Request = {
    token: string;
    email: string;
    newPassword: string;
  };
}
