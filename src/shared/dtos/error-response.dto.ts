import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message or array of error messages',
    oneOf: [
      { type: 'string', example: 'Invalid credentials' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be a valid email', 'password is required'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/auth/session',
    type: String,
  })
  path: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Array of validation error messages',
    example: [
      'email must be a valid email',
      'password must be longer than 6 characters',
    ],
    type: [String],
  })
  message: string[];

  @ApiProperty({
    description: 'Error type for validation errors',
    example: 'Bad Request',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/auth/session',
    type: String,
  })
  path: string;
}

export class ConflictErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 409,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Conflict error message',
    example: 'User with this email already exists',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error type for conflict errors',
    example: 'Conflict',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/users',
    type: String,
  })
  path: string;
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Unauthorized error message',
    example: 'Invalid credentials',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error type for unauthorized errors',
    example: 'Unauthorized',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/auth/session',
    type: String,
  })
  path: string;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Not found error message',
    example: 'User not found',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error type for not found errors',
    example: 'Not Found',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/auth/password',
    type: String,
  })
  path: string;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 500,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Internal server error message',
    example: 'Internal server error',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error type for server errors',
    example: 'Internal Server Error',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/auth/session',
    type: String,
  })
  path: string;
}
