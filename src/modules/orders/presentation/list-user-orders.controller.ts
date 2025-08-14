import { Controller, Get, HttpCode, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ListUserOrdersService } from '@/modules/orders/application/services/list-user-orders/list-user-orders.service';
import { PaginationQueryDto } from '@/shared/dtos/pagination-query.dto';
import { OrderListResponseDto } from '@/modules/orders/application/dtos/responses/order-list-response.dto';
import {
  ValidationErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '@/shared/dtos/error-response.dto';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

@ApiTags('Orders')
@Controller('orders')
export class ListUserOrdersController {
  constructor(private readonly listUserOrdersService: ListUserOrdersService) {}

  @Get('/user/:userId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List user orders',
    description: 'Get paginated list of orders for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({ type: PaginationQueryDto })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
    type: OrderListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async listUserOrders(
    @Param('userId') userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return await this.listUserOrdersService.execute({
      userId,
      ...query,
    });
  }
}
