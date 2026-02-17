import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
@Unique(['username'])
export class User {
  @ApiProperty({ example: 1, description: 'ID користувача' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'user123', description: 'Логін користувача' })
  @Column()
  username: string;

  @ApiProperty({
    example: '$2b$10$...',
    description: 'Хеш паролю (не повертається в API)',
  })
  @Column()
  passwordHash: string;
}
