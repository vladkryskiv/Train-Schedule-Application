import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresInRaw = configService.get<string>('JWT_EXPIRES_IN');

        const jwtOptions: JwtModuleOptions = {};

        if (secret) {
          jwtOptions.secret = secret;
        }

        if (expiresInRaw) {
          jwtOptions.signOptions = {
            ...(jwtOptions.signOptions ?? {}),
            expiresIn: expiresInRaw as unknown as StringValue,
          };
        }

        return jwtOptions;
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
