import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@/shared/services/jwt/jwt.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject('JwtService')
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    payload: RefreshTokenService.Request,
  ): Promise<RefreshTokenService.Response> {
    const refreshToken = this.jwtService.refresh(payload.acessToken, {
      expiresIn: '6h',
    });

    return {
      acessToken: refreshToken,
    };
  }
}

export namespace RefreshTokenService {
  export type Request = {
    acessToken: string;
  };

  export type Response = {
    acessToken: string;
  };
}
