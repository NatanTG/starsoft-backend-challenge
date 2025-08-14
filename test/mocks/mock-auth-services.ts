import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

export class SessionServiceSpy {
  executeCalled = false;
  executeArgs: any = null;
  executeReturn: { acessToken: string } = {
    acessToken: 'jwt_token_example_12345',
  };
  executeError: Error | null = null;

  async execute(payload: any): Promise<{ acessToken: string }> {
    this.executeCalled = true;
    this.executeArgs = payload;

    if (payload.email === 'invalid@test.com') {
      throw new BadRequestException('Invalid credentials');
    }

    if (this.executeError) {
      throw this.executeError;
    }

    return this.executeReturn;
  }

  reset() {
    this.executeCalled = false;
    this.executeArgs = null;
    this.executeReturn = { acessToken: 'jwt_token_example_12345' };
    this.executeError = null;
  }
}

export class RefreshTokenServiceSpy {
  executeCalled = false;
  executeArgs: any = null;
  executeReturn: { acessToken: string } = {
    acessToken: 'new_jwt_token_example_12345',
  };
  executeError: Error | null = null;

  async execute(payload: any): Promise<{ acessToken: string }> {
    this.executeCalled = true;
    this.executeArgs = payload;

    if (this.executeError) {
      throw this.executeError;
    }

    return this.executeReturn;
  }

  reset() {
    this.executeCalled = false;
    this.executeArgs = null;
    this.executeReturn = { acessToken: 'new_jwt_token_example_12345' };
    this.executeError = null;
  }
}

export class ForgotPasswordServiceSpy {
  executeCalled = false;
  executeArgs: any = null;
  executeError: Error | null = null;

  async execute(payload: any): Promise<void> {
    this.executeCalled = true;
    this.executeArgs = payload;

    if (this.executeError) {
      throw this.executeError;
    }

    return;
  }

  reset() {
    this.executeCalled = false;
    this.executeArgs = null;
    this.executeError = null;
  }
}

export class ResetPasswordServiceSpy {
  executeCalled = false;
  executeArgs: any = null;
  executeError: Error | null = null;

  async execute(payload: any): Promise<void> {
    this.executeCalled = true;
    this.executeArgs = payload;

    if (this.executeError) {
      throw this.executeError;
    }

    return;
  }

  reset() {
    this.executeCalled = false;
    this.executeArgs = null;
    this.executeError = null;
  }
}

