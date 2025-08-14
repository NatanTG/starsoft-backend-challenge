export type JwtTokenPayload = {
  id?: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
};

export interface JwtService {
  sign(
    payload: string | object | Buffer,
    secret?: string,
    options?: any,
  ): string;
  verify(token: string, secret?: string, options?: any): JwtTokenPayload;
  refresh(token: string, options?: any): string;
}
