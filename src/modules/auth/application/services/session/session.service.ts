import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/infrastructure/repositories/user.repository';
import { CryptService } from '@/shared/services/crypt/crypt.service';
import { JwtService } from '@/shared/services/jwt/jwt.service';

@Injectable()
export class SessionService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('CryptService')
    private readonly cryptService: CryptService,

    @Inject('JwtService')
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    payload: SessionService.Request,
  ): Promise<SessionService.Response> {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    const isValidPassword = await this.cryptService.compare(
      payload.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials.');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
    };
  }
}

export namespace SessionService {
  export type Request = {
    email: string;
    password: string;
  };

  export type Response = {
    accessToken: string;
  };
}
