import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Система')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Перевірка стану сервера' })
  @ApiResponse({
    status: 200,
    description: 'Сервер працює',
    schema: {
      type: 'object',
      properties: { status: { type: 'string', example: 'ok' } },
    },
  })
  getHealth(): { status: string } {
    return this.appService.getHealth();
  }
}
