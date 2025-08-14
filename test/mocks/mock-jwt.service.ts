import { JwtService } from '@/shared/services/jwt/jwt.service';

export class MockJwtService implements JwtService {
  private signSpy = jest.fn();
  private verifySpy = jest.fn();
  private refreshSpy = jest.fn();
  
  signReturn: string = 'mock-jwt-token';
  verifyReturn: any = {
    userId: 'user-123',
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  refreshReturn: string = 'new-access-token';
  shouldThrowOnVerify: boolean = false;

  sign(payload: any, secret?: string, options?: any): string {
    this.signSpy(payload, secret, options);
    
    if (payload.error) {
      throw new Error('Sign error');
    }
    
    return this.signReturn;
  }

  verify(token: string, secret?: string): any {
    this.verifySpy(token, secret);
    
    if (this.shouldThrowOnVerify) {
      throw new Error('Invalid token');
    }
    
    if (token === 'invalid-token') {
      throw new Error('Invalid token');
    }
    
    if (token === 'expired-token') {
      throw new Error('Token expired');
    }
    
    return this.verifyReturn;
  }

  refresh(token: string, options?: any): string {
    this.refreshSpy(token, options);
    return this.refreshReturn;
  }

  getSignSpy() {
    return this.signSpy;
  }

  getVerifySpy() {
    return this.verifySpy;
  }

  getRefreshSpy() {
    return this.refreshSpy;
  }

  resetSpies() {
    this.signSpy.mockReset();
    this.verifySpy.mockReset();
    this.refreshSpy.mockReset();
  }

  reset() {
    this.signReturn = 'mock-jwt-token';
    this.verifyReturn = {
      userId: 'user-123',
      email: 'test@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    this.refreshReturn = 'new-access-token';
    this.shouldThrowOnVerify = false;
    this.resetSpies();
  }
}