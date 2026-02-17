import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TrainsService } from './trains.service';
import { Train } from './train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SortDirection } from './types/sort.types';
import { PaginatedResponseDto } from './dto/pagination.dto';
import { GetTrainsQueryDto } from './dto/get-trains-query.dto';
import { normalizePagination } from './utils/pagination.util';

@ApiTags('Поїзди')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @Get()
  @ApiOperation({
    summary: 'Отримати список поїздів з пошуком, сортуванням та пагінацією',
  })
  @ApiResponse({
    status: 200,
    description: 'Список поїздів з пагінацією',
    type: PaginatedResponseDto,
  })
  async getTrains(
    @Query() query: GetTrainsQueryDto,
  ): Promise<PaginatedResponseDto<Train>> {
    const safeSortDirection: SortDirection =
      query.sortDirection === 'desc' ? 'desc' : 'asc';
    const safeSortBy = query.sortBy ?? null;
    const searchValue = query.search ?? null;
    const { page: pageNumber, limit: limitNumber } = normalizePagination({
      page: query.page,
      limit: query.limit,
    });

    return this.trainsService.findAll(
      searchValue,
      safeSortBy,
      safeSortDirection,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати поїзд за ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID поїзда' })
  @ApiResponse({ status: 200, description: 'Поїзд знайдено', type: Train })
  @ApiResponse({ status: 404, description: 'Поїзд не знайдено' })
  async getTrain(@Param('id', ParseIntPipe) id: number): Promise<Train> {
    return this.trainsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий поїзд' })
  @ApiResponse({ status: 201, description: 'Поїзд створено', type: Train })
  @ApiResponse({ status: 400, description: 'Невірні дані' })
  @ApiBody({ type: CreateTrainDto })
  async createTrain(@Body() body: CreateTrainDto): Promise<Train> {
    return this.trainsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Повністю оновити поїзд' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID поїзда' })
  @ApiResponse({ status: 200, description: 'Поїзд оновлено', type: Train })
  @ApiResponse({ status: 404, description: 'Поїзд не знайдено' })
  @ApiBody({ type: CreateTrainDto })
  async replaceTrain(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTrainDto,
  ): Promise<Train> {
    const updateDto: UpdateTrainDto = { ...body };
    return this.trainsService.update(id, updateDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частково оновити поїзд' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID поїзда' })
  @ApiResponse({ status: 200, description: 'Поїзд оновлено', type: Train })
  @ApiResponse({ status: 404, description: 'Поїзд не знайдено' })
  @ApiBody({ type: UpdateTrainDto })
  async updateTrain(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTrainDto,
  ): Promise<Train> {
    return this.trainsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити поїзд' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID поїзда' })
  @ApiResponse({ status: 200, description: 'Поїзд видалено' })
  @ApiResponse({ status: 404, description: 'Поїзд не знайдено' })
  async deleteTrain(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.trainsService.remove(id);
  }
}
