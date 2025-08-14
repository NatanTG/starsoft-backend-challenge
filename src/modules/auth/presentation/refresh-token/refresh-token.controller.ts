import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RefreshTokenService } from '@/modules/auth/application/services/refresh-token/refresh-token.service';
import { RefreshTokenRequestDto } from '@/modules/auth/application/dtos/requests/refresh-token-request.dto';
import { RefreshTokenResponseDto } from '@/modules/auth/application/dtos/responses/refresh-token-response.dto';
import {
  ValidationErrorResponseDto,
  UnauthorizedErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post('/refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using the current valid token',
  })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Current access token to be refreshed',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully - Returns new JWT access token',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation errors - Invalid token format or missing token',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token refresh failed - Invalid or expired token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async refreshToken(
    @Body() payload: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenService.execute(payload);
  }
}
