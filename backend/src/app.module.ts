import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Train } from './trains/train.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TrainsModule } from './trains/trains.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Train],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TrainsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
