import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SessionService } from '@/modules/auth/application/services/session/session.service';
import { LoginResponseDto } from '@/modules/auth/application/dtos/responses/login-response.dto';
import {
  ValidationErrorResponseDto,
  UnauthorizedErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';
import { SessionUserRequestDto } from '../../application/dtos/requests/session-user-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/session')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password to receive access token',
  })
  @ApiBody({
    type: SessionUserRequestDto,
    description: 'User credentials for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Returns JWT access token',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation errors - Invalid email format or missing fields',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed - Invalid credentials',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async login(@Body() payload: SessionUserRequestDto): Promise<LoginResponseDto> {
    return await this.sessionService.execute(payload);
  }
}
