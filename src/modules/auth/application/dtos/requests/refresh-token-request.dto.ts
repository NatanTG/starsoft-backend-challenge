import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Current access token to be refreshed',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    minLength: 10,
  })
  @IsString({ message: 'Access token must be a string' })
  @MinLength(10, {
    message: 'Access token must be at least 10 characters long',
  })
  acessToken: string;
}
