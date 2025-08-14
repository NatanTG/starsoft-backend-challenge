import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserRequestDto } from '@/modules/user/application/dto/requests/create-user-request.dto';
import { CreateUserService } from '@/modules/user/application/service/create-user/create-user.service';
import {
  ValidationErrorResponseDto,
  ConflictErrorResponseDto,
  InternalServerErrorResponseDto,
} from '@/shared/dtos/error-response.dto';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('/')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create new user',
    description: 'Register a new user account in the system',
  })
  @ApiBody({
    type: CreateUserRequestDto,
    description: 'User registration data',
  })
  @ApiResponse({
    status: 201,
    description:
      'User created successfully - Account created and confirmation email sent',
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation errors - Invalid email format, password too short, or missing fields',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists - Email address is already registered',
    type: ConflictErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async createUser(@Body() payload: CreateUserRequestDto): Promise<void> {
    await this.createUserService.execute(payload);
  }
}
