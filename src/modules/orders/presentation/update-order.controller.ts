import { Body, Controller, HttpCode, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateOrderService } from '@/modules/orders/application/services/update-order/update-order.service';
import { UpdateOrderRequestDto } from '@/modules/orders/application/dtos/requests/update-order-request.dto';
import { OrderResponseDto } from '@/modules/orders/application/dtos/responses/order-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '@/shared/dtos/error-response.dto';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

@ApiTags('Orders')
@Controller('orders')
export class UpdateOrderController {
  constructor(private readonly updateOrderService: UpdateOrderService) {}

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update order',
    description: 'Update order status and other modifiable fields',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order status',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    type: UnauthorizedErrorResponseDto,
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
  async updateOrder(
    @Param('id') id: string,
    @Body() payload: UpdateOrderRequestDto,
  ) {
    return await this.updateOrderService.execute({ id, ...payload });
  }
}
