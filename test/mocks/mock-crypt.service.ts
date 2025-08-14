import { CryptService } from '@/shared/services/crypt/crypt.service';

export class MockCryptService implements CryptService {
  private compareSpy = jest.fn();
  private hashSpy = jest.fn();
  
  compareReturn: boolean = true;
  hashReturn: string = 'hashed-password';

  async compare(value: string, hash: string): Promise<boolean> {
    this.compareSpy(value, hash);
    return this.compareReturn;
  }

  async hash(value: string, salt: number): Promise<string> {
    this.hashSpy(value, salt);
    return this.hashReturn;
  }

  getCompareSpy() {
    return this.compareSpy;
  }

  getHashSpy() {
    return this.hashSpy;
  }

  resetSpies() {
    this.compareSpy.mockReset();
    this.hashSpy.mockReset();
  }

  reset() {
    this.compareReturn = true;
    this.hashReturn = 'hashed-password';
    this.resetSpies();
  }
}