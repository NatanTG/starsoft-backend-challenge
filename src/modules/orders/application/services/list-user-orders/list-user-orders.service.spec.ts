import { NotFoundException } from '@nestjs/common';
import { ListUserOrdersService } from './list-user-orders.service';
import { MockOrderRepository } from '../../../../../../test/mocks/mock-order-repository';
import { MockUserRepository } from '../../../../../../test/mocks/mock-user-repository';
import { MockFactory } from '../../../../../../test/mocks/mock-factory';

describe('ListUserOrdersService', () => {
  let service: ListUserOrdersService;
  let mockOrderRepository: MockOrderRepository;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockOrderRepository = new MockOrderRepository();
    mockUserRepository = new MockUserRepository();
    
    service = new ListUserOrdersService(
      mockOrderRepository,
      mockUserRepository,
    );
  });

  afterEach(async () => {
    await MockFactory.cleanup();
  });

  it('should list user orders successfully', async () => {
    const request: ListUserOrdersService.Request = {
      userId: 'user-123',
      page: 1,
      limit: 10,
      offset: 0,
    };

    const result = await service.execute(request);

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        limit: 10,
      }),
    );
  });

  it('should throw NotFoundException when user not found', async () => {
    const request: ListUserOrdersService.Request = {
      userId: 'not-found-user',
      page: 1,
      limit: 10,
      offset: 0,
    };

    await expect(service.execute(request)).rejects.toThrow(NotFoundException);
  });
});