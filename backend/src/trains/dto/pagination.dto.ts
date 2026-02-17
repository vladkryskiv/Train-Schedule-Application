import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Номер сторінки',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Кількість елементів на сторінці',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Дані', type: 'array', isArray: true })
  data: T[];

  @ApiProperty({ example: 100, description: 'Загальна кількість елементів' })
  total: number;

  @ApiProperty({ example: 1, description: 'Поточна сторінка' })
  page: number;

  @ApiProperty({ example: 10, description: 'Кількість елементів на сторінці' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Загальна кількість сторінок' })
  totalPages: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
