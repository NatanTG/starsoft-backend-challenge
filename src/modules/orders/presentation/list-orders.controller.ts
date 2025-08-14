import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ListOrdersService } from '@/modules/orders/application/services/list-orders/list-orders.service';
import { PaginationQueryDto } from '@/shared/dtos/pagination-query.dto';
import { OrderListResponseDto } from '@/modules/orders/application/dtos/responses/order-list-response.dto';
import { InternalServerErrorResponseDto } from '@/shared/dtos/error-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class ListOrdersController {
  constructor(private readonly listOrdersService: ListOrdersService) {}

  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all orders',
    description: 'Get paginated list of all orders in the system',
  })
  @ApiQuery({ type: PaginationQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: OrderListResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async listOrders(@Query() query: PaginationQueryDto) {
    return await this.listOrdersService.execute(query);
  }
}
