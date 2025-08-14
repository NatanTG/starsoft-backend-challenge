import { ApiProperty } from '@nestjs/swagger';

export class DeleteOrderResponseDto {
  @ApiProperty({
    description: 'Success message for order deletion',
    example: 'Order deleted successfully',
    type: String,
  })
  message: string;
}