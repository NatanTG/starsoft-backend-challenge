import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Order item unique identifier',
    example: 'fc4435c2-cc71-4e24-bc9d-93169d43a7ef',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 13 Pro',
    type: String,
  })
  productName: string;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2,
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 999.99,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Subtotal (quantity * price)',
    example: 1999.98,
    type: Number,
  })
  subtotal: number;
}
