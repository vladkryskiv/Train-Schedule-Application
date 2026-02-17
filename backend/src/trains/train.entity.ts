import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('trains')
export class Train {
  @ApiProperty({ example: 1, description: 'ID поїзда' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Київ', description: 'Станція відправлення' })
  @Index()
  @Column()
  fromStation: string;

  @ApiProperty({ example: 'Львів', description: 'Станція прибуття' })
  @Index()
  @Column()
  toStation: string;

  @ApiProperty({
    example: '2026-02-20T10:00:00Z',
    description: 'Час відправлення',
  })
  @Column({ type: 'timestamptz' })
  departureTime: Date;

  @ApiProperty({ example: '2026-02-20T15:30:00Z', description: 'Час прибуття' })
  @Column({ type: 'timestamptz' })
  arrivalTime: Date;

  @ApiProperty({ example: 250.5, description: 'Ціна квитка' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: '123А', description: 'Номер поїзда' })
  @Index()
  @Column()
  trainNumber: string;
}
