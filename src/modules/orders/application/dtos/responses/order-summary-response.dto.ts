import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderSummaryResponseDto {
  @ApiProperty({
    description: 'Order unique identifier',
    example: 'fc4435c2-cc71-4e24-bc9d-93169d43a7ef',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: 'fc4435c2-cc71-4e24-bc9d-93169d43a7ef',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'Current order status',
    example: OrderStatus.PENDING,
    type: String,
  })
  status: string;

  @ApiProperty({
    description: 'Total amount of the order',
    example: 1999.98,
    type: Number,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'List of ordered items',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Order creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Order last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  updatedAt: string;
}
