import { Body, Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    const numericId = Number(id);
    return this.usersService.findById(numericId);
  }
}
