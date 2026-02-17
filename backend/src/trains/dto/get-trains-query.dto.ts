import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { SortDirection, SortableField } from '../types/sort.types';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../constants/pagination.constants';

export class GetTrainsQueryDto {
  @ApiPropertyOptional({
    description: 'Пошук за станціями або номером поїзда',
    example: 'Київ',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Поле для сортування',
    enum: ['departureTime', 'arrivalTime', 'price', 'trainNumber'],
    example: 'departureTime',
  })
  @IsOptional()
  @IsEnum(['departureTime', 'arrivalTime', 'price', 'trainNumber'])
  sortBy?: SortableField;

  @ApiPropertyOptional({
    description: 'Напрямок сортування',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortDirection?: SortDirection;

  @ApiPropertyOptional({
    description: 'Номер сторінки (за замовчуванням: 1)',
    example: 1,
    default: DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Кількість елементів на сторінці (за замовчуванням: 10)',
    example: 10,
    default: DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;
}
