import { ApiProperty } from '@nestjs/swagger';
import { OrderSummaryResponseDto } from './order-summary-response.dto';

export class SearchOrdersResponseDto {
  @ApiProperty({
    description: 'List of orders found by search',
    type: [OrderSummaryResponseDto],
  })
  orders: OrderSummaryResponseDto[];

  @ApiProperty({
    description: 'Total number of orders found',
    example: 25,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
    type: Number,
  })
  totalPages: number;
}