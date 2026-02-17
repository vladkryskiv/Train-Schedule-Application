import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Train } from './train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { SortDirection, SortableField } from './types/sort.types';
import { PaginatedResponseDto } from './dto/pagination.dto';
import { SEARCH_FIELDS } from './constants/search.constants';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from './constants/pagination.constants';
import { UPDATEABLE_FIELDS } from './constants/update.constants';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private readonly trainsRepository: Repository<Train>,
  ) {}

  async create(createDto: CreateTrainDto): Promise<Train> {
    const train = this.trainsRepository.create(createDto);
    return this.trainsRepository.save(train);
  }

  async findAll(
    search: string | null,
    sortBy: SortableField | null,
    sortDirection: SortDirection,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
  ): Promise<PaginatedResponseDto<Train>> {
    const query = this.trainsRepository.createQueryBuilder('train');

    this.applySearchFilter(query, search);
    this.applySorting(query, sortBy, sortDirection);

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  private applySearchFilter(
    query: SelectQueryBuilder<Train>,
    search: string | null,
  ): void {
    if (!search?.trim()) {
      return;
    }

    const searchPattern = `%${search.trim().toLowerCase()}%`;
    const conditions = SEARCH_FIELDS.map(
      (f) => `LOWER(train.${f}) LIKE :like`,
    ).join(' OR ');
    query.where(`(${conditions})`, { like: searchPattern });
  }

  private applySorting(
    query: SelectQueryBuilder<Train>,
    sortBy: SortableField | null,
    sortDirection: SortDirection,
  ): void {
    if (sortBy) {
      query.orderBy(
        `train.${sortBy}`,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      query.orderBy('train.departureTime', 'ASC');
    }
  }

  async findOne(id: number): Promise<Train> {
    const train = await this.trainsRepository.findOne({ where: { id } });
    if (!train) {
      throw new NotFoundException(`Train with id ${id} not found`);
    }
    return train;
  }

  async update(id: number, updateDto: UpdateTrainDto): Promise<Train> {
    const train = await this.findOne(id);

    const updates: Partial<Train> = {};

    UPDATEABLE_FIELDS.forEach((field) => {
      if (updateDto[field] !== undefined) {
        updates[field as keyof Train] = updateDto[field] as never;
      }
    });

    Object.assign(train, updates);

    return this.trainsRepository.save(train);
  }

  async remove(id: number): Promise<void> {
    const result = await this.trainsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Train with id ${id} not found`);
    }
  }
}
