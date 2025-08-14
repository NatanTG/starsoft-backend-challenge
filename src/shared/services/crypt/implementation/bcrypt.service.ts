import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CryptService } from '@/shared/services/crypt/crypt.service';

@Injectable()
export class BcryptService implements CryptService {
  async hash(
    data: string | Buffer,
    saltOrRounds: number | string,
  ): Promise<string> {
    return await bcrypt.hash(data, saltOrRounds);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
