import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user123',
    description: 'Логін користувача',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль користувача',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
