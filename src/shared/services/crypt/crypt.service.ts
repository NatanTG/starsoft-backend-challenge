export interface CryptService {
  hash(data: string | Buffer, saltOrRounds: number | string): Promise<string>;
  compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
