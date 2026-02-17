import {
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainDto {
  @ApiPropertyOptional({
    example: 'Київ',
    description: 'Станція відправлення',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fromStation?: string;

  @ApiPropertyOptional({
    example: 'Львів',
    description: 'Станція прибуття',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  toStation?: string;

  @ApiPropertyOptional({
    example: '2026-02-20T10:00',
    description: 'Час відправлення (YYYY-MM-DDTHH:mm)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message: 'departureTime має бути у форматі YYYY-MM-DDTHH:mm',
  })
  departureTime?: string;

  @ApiPropertyOptional({
    example: '2026-02-20T15:30',
    description: 'Час прибуття (YYYY-MM-DDTHH:mm)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message: 'arrivalTime має бути у форматі YYYY-MM-DDTHH:mm',
  })
  arrivalTime?: string;

  @ApiPropertyOptional({
    example: 250.5,
    description: 'Ціна квитка',
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    example: '123А',
    description: 'Номер поїзда',
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  trainNumber?: string;
}
