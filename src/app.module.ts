import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import configuration from '../config/configuration';
import { AuthModule } from './auth/auth.module';
import { BookmarkService } from './bookmark/bookmark.service';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    BookmarkModule,
  ],
  providers: [BookmarkService],
})
export class AppModule {}
