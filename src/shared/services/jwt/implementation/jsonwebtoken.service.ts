import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtTokenPayload } from '@/shared/services/jwt/jwt.service';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { env } from '@/core/env';

@Injectable()
export class JsonWebTokenService implements JwtService {
  private readonly secret = env.JWT_SECRET;

  sign(
    payload: string | object | Buffer,
    secret?: string,
    options?: any,
  ): string {
    return sign(payload, secret ?? this.secret, { expiresIn: '1h' });
  }

  verify(token: string, secret?: string, options?: any): JwtTokenPayload {
    try {
      return verify(token, secret ?? this.secret, options);
    } catch (error) {
      throw new UnauthorizedException('Token invalid!');
    }
  }
  refresh(token: string, options?: any): string {
    try {
      const decoded = verify(token, this.secret) as JwtPayload;
      const { id, email, iat, exp, ...payload } = decoded;

      return sign(payload, this.secret, {
        expiresIn: options?.expiresIn || '1h',
      });
    } catch {
      throw new UnauthorizedException('refresh token invalid');
    }
  }
}
