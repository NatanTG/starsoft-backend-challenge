import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateOrderService } from '@/modules/orders/application/services/create-order/create-order.service';
import { CreateOrderRequestDto } from '@/modules/orders/application/dtos/requests/create-order-request.dto';
import { OrderResponseDto } from '@/modules/orders/application/dtos/responses/order-response.dto';
import {
  ValidationErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';
import { AuthGuard } from '@/shared/guards/jwt-auth-guard';

@ApiTags('Orders')
@Controller('orders')
export class CreateOrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Post('/')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new order',
    description: 'Create a new order with items for authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation errors or user not found',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async createOrder(
    @Body() payload: CreateOrderRequestDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.createOrderService.execute({
      userId,
      items: payload.items,
    });
    return;
  }
}
