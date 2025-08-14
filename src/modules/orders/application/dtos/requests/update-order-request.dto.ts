import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';

export class UpdateOrderRequestDto {
  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
