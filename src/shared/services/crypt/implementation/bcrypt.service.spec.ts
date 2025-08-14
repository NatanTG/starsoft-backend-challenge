import * as bcrypt from 'bcrypt';
import { BcryptService } from './bcrypt.service';

jest.mock('bcrypt');

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BcryptService();
  });

  it('should call bcrypt.hash with the correct parameters', async () => {
    const data = 'password123';
    const saltOrRounds = 10;
    const hashedPassword = 'hashedPassword123';

    const hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValueOnce(hashedPassword as never);

    const result = await service.hash(data, saltOrRounds);

    expect(hashSpy).toHaveBeenCalledWith(data, saltOrRounds);
    expect(result).toBe(hashedPassword);
  });
  it('should call bcrypt.compare and return true for matching data', async () => {
    const data = 'password123';
    const encrypted = 'hashedPassword123';

    const compareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as never);

    const result = await service.compare(data, encrypted);

    expect(compareSpy).toHaveBeenCalledWith(data, encrypted);
    expect(result).toBe(true);
  });
  it('should call bcrypt.compare and return false for non-matching data', async () => {
    const data = 'wrongPassword';
    const encrypted = 'hashedPassword123';

    const compareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(false as never);

    const result = await service.compare(data, encrypted);

    expect(compareSpy).toHaveBeenCalledWith(data, encrypted);
    expect(result).toBe(false);
  });
});
