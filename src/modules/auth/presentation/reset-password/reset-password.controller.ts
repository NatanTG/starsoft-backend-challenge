import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResetPasswordService } from '@/modules/auth/application/services/reset-password/reset-password.service';
import { ResetPasswordRequestDto } from '@/modules/auth/application/dtos/requests/reset-password-request.dto';
import {
  ValidationErrorResponseDto,
  UnauthorizedErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Put('/password')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Reset user password',
    description: 'Reset user password using token received by email',
  })
  @ApiBody({
    type: ResetPasswordRequestDto,
    description: 'Password reset data including token, email and new password',
  })
  @ApiResponse({
    status: 204,
    description: 'Password reset successful - No content returned',
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation errors - Invalid token, email format, or password requirements',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description:
      'Password reset failed - Invalid or expired token, or user not found',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async resetPassword(@Body() payload: ResetPasswordRequestDto): Promise<void> {
    await this.resetPasswordService.execute(payload);
  }
}
