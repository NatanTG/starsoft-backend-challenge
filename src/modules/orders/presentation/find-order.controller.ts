import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FindOrderService } from '@/modules/orders/application/services/find-order/find-order.service';
import { OrderResponseDto } from '@/modules/orders/application/dtos/responses/order-response.dto';
import {
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class FindOrderController {
  constructor(private readonly findOrderService: FindOrderService) {}

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve detailed information about a specific order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async findOrder(@Param('id') id: string) {
    return await this.findOrderService.execute({ id });
  }
}
