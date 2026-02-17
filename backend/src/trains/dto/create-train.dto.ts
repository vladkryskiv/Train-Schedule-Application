import {
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainDto {
  @ApiProperty({
    example: 'Київ',
    description: 'Станція відправлення',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fromStation: string;

  @ApiProperty({
    example: 'Львів',
    description: 'Станція прибуття',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  toStation: string;

  @ApiProperty({
    example: '2026-02-20T10:00',
    description: 'Час відправлення (YYYY-MM-DDTHH:mm)',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message: 'departureTime має бути у форматі YYYY-MM-DDTHH:mm',
  })
  departureTime: string;

  @ApiProperty({
    example: '2026-02-20T15:30',
    description: 'Час прибуття (YYYY-MM-DDTHH:mm)',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message: 'arrivalTime має бути у форматі YYYY-MM-DDTHH:mm',
  })
  arrivalTime: string;

  @ApiProperty({ example: 250.5, description: 'Ціна квитка', minimum: 0.01 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: '123А',
    description: 'Номер поїзда',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  trainNumber: string;
}
