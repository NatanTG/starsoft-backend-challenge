import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { OrderStatus } from '@/modules/orders/domain/enums/order-status.enum';

export class SearchOrdersRequestDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiHideProperty()
  @Transform(({ obj }) => (obj.page - 1) * obj.limit)
  @IsOptional()
  @IsNumber()
  offset: number;

  @ApiPropertyOptional({
    description: 'Search by specific order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Filter by order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by orders created from this date (ISO format)',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by orders created until this date (ISO format)',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Search by product name in order items (fuzzy search)',
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  productName?: string;
}
