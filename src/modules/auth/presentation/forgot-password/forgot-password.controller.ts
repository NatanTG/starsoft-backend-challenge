import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ForgotPasswordService } from '@/modules/auth/application/services/forgot-password/forgot-password.service';
import { ForgotPasswordRequestDto } from '@/modules/auth/application/dtos/requests/forgot-password-request.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('/password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset link to user email address',
  })
  @ApiBody({
    type: ForgotPasswordRequestDto,
    description: 'User email to send password reset link',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully (if email exists)',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation errors - Invalid email format',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found - Email does not exist in system',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async forgotPassword(@Body() payload: ForgotPasswordRequestDto): Promise<void> {
    await this.forgotPasswordService.execute(payload);
  }
}
