import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'fc4435c2-cc71-4e24-bc9d-93169d43a7ef',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@email.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  updatedAt: string;
}