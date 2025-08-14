import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';
import { MockJwtService } from 'test/mocks/mock-jwt.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let mockJwtService: MockJwtService;

  beforeEach(async () => {
    mockJwtService = new MockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: 'JwtService',
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  afterEach(() => {
    mockJwtService.reset();
  });

  it('should return new access token', async () => {
    mockJwtService.refreshReturn = 'new-refreshed-token';

    const request = {
      acessToken: 'old-access-token',
    };

    const result = await service.execute(request);

    expect(result).toEqual({
      acessToken: 'new-refreshed-token',
    });
  });

  it('should call jwt service refresh with correct parameters', async () => {
    const refreshSpy = mockJwtService.getRefreshSpy();

    const request = {
      acessToken: 'old-access-token',
    };

    await service.execute(request);

    expect(refreshSpy).toHaveBeenCalledWith('old-access-token', {
      expiresIn: '6h',
    });
  });
});