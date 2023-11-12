import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../../config/configuration';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configuration().authentication.accessTokenSecret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
