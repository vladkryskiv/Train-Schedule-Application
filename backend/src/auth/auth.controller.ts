import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedRequest, LoginResponse } from './types/auth.types';
import { User } from '../users/user.entity';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ status: 201, description: 'Користувач успішно створено' })
  @ApiResponse({ status: 400, description: 'Невірні дані' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto): Promise<User> {
    return this.authService.register(body.username, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вхід в систему' })
  @ApiResponse({
    status: 200,
    description: 'Успішний вхід',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Невірні облікові дані' })
  @ApiBody({ type: LoginDto })
  async login(
    @Req() req: AuthenticatedRequest,
    @Body() _body: LoginDto,
  ): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }
}
