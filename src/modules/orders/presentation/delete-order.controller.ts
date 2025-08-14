import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteOrderService } from '@/modules/orders/application/services/delete-order/delete-order.service';
import { DeleteOrderResponseDto } from '@/modules/orders/application/dtos/responses/delete-order-response.dto';
import {
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '@/shared/dtos/error-response.dto';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

@ApiTags('Orders')
@Controller('orders')
export class DeleteOrderController {
  constructor(private readonly deleteOrderService: DeleteOrderService) {}

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete order',
    description: 'Remove an order from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
    type: DeleteOrderResponseDto,
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
  async deleteOrder(@Param('id') id: string) {
    return await this.deleteOrderService.execute({ id });
  }
}
